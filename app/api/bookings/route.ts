import { and, eq, gt, lt, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { getStay } from "@/app/stays";
import { bookingInputSchema } from "@/lib/booking-validation";
import { getServerEnv } from "@/lib/env";
import { getMidtransSnap } from "@/lib/midtrans";

export const runtime = "nodejs";

const HOLD_DURATION_MINUTES = 30;

function nightsBetween(checkIn: string, checkOut: string) {
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  return Math.round((end - start) / 86400000);
}

export async function POST(request: Request) {
  const input = bookingInputSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!input.success) {
    return NextResponse.json(
      { message: "Periksa kembali data booking Anda", errors: input.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const stay = getStay(input.data.accommodationId);
  if (stay.id !== input.data.accommodationId) {
    return NextResponse.json({ message: "Akomodasi tidak ditemukan" }, { status: 404 });
  }

  if (input.data.guestCount > stay.guests) {
    return NextResponse.json(
      { message: `Akomodasi ini hanya tersedia untuk ${stay.guests} tamu` },
      { status: 400 },
    );
  }

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" });
  const nights = nightsBetween(input.data.checkIn, input.data.checkOut);
  if (input.data.checkIn < today || nights < 1) {
    return NextResponse.json({ message: "Tanggal menginap tidak valid" }, { status: 400 });
  }

  const orderId = `KAIA-${crypto.randomUUID()}`;
  const totalAmount = stay.price * nights;
  const expiresAt = new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000);

  const booking = await db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${input.data.accommodationId}))`,
    );

    const conflict = await transaction.query.bookings.findFirst({
      where: and(
        eq(bookings.accommodationId, input.data.accommodationId),
        lt(bookings.checkIn, input.data.checkOut),
        gt(bookings.checkOut, input.data.checkIn),
        or(
          eq(bookings.status, "confirmed"),
          and(eq(bookings.status, "pending"), gt(bookings.expiresAt, new Date())),
        ),
      ),
      columns: { id: true },
    });

    if (conflict) return null;

    const [created] = await transaction
      .insert(bookings)
      .values({
        orderId,
        accommodationId: stay.id,
        guestName: input.data.guestName,
        guestEmail: input.data.guestEmail,
        guestPhone: input.data.guestPhone,
        checkIn: input.data.checkIn,
        checkOut: input.data.checkOut,
        guestCount: input.data.guestCount,
        totalAmount,
        notes: input.data.notes || null,
        expiresAt,
      })
      .returning();

    return created;
  });

  if (!booking) {
    return NextResponse.json(
      { message: "Tanggal tersebut baru saja dipesan. Silakan pilih tanggal lain." },
      { status: 409 },
    );
  }

  try {
    const env = getServerEnv();
    const nameParts = input.data.guestName.split(" ");
    const transaction = await getMidtransSnap().createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: [
        {
          id: stay.id,
          price: stay.price,
          quantity: nights,
          name: `${stay.name} - ${nights} malam`.slice(0, 50),
        },
      ],
      customer_details: {
        first_name: nameParts.shift(),
        last_name: nameParts.join(" "),
        email: input.data.guestEmail,
        phone: input.data.guestPhone,
      },
      expiry: {
        unit: "minutes",
        duration: HOLD_DURATION_MINUTES,
      },
      callbacks: {
        finish: `${env.NEXT_PUBLIC_APP_URL}/booking/status?order_id=${encodeURIComponent(orderId)}`,
      },
    });

    await db
      .update(bookings)
      .set({
        snapToken: transaction.token,
        snapRedirectUrl: transaction.redirect_url,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking.id));

    return NextResponse.json({
      orderId,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch {
    await db
      .update(bookings)
      .set({ status: "cancelled", paymentStatus: "cancelled", updatedAt: new Date() })
      .where(eq(bookings.id, booking.id));

    return NextResponse.json(
      { message: "Pembayaran belum dapat dibuat. Silakan coba kembali." },
      { status: 502 },
    );
  }
}
