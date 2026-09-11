import { createHash, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { bookings, paymentNotifications } from "@/db/schema";
import { getServerEnv } from "@/lib/env";
import { mapMidtransStatus } from "@/lib/payment-status";

export const runtime = "nodejs";

const notificationSchema = z.object({
  order_id: z.string().min(1),
  status_code: z.string().min(1),
  gross_amount: z.string().min(1),
  signature_key: z.string().length(128),
  transaction_status: z.string().min(1),
  transaction_id: z.string().optional(),
  fraud_status: z.string().optional(),
});

function hasValidSignature(notification: z.infer<typeof notificationSchema>) {
  const expected = createHash("sha512")
    .update(
      notification.order_id +
        notification.status_code +
        notification.gross_amount +
        getServerEnv().MIDTRANS_SERVER_KEY,
    )
    .digest("hex");

  return timingSafeEqual(Buffer.from(expected), Buffer.from(notification.signature_key));
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsed = notificationSchema.safeParse(payload);

  if (!parsed.success || !hasValidSignature(parsed.data)) {
    return NextResponse.json({ message: "Notifikasi tidak valid" }, { status: 401 });
  }

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.orderId, parsed.data.order_id),
  });

  if (!booking) {
    return NextResponse.json({ message: "Booking tidak ditemukan" }, { status: 404 });
  }

  if (Number(parsed.data.gross_amount) !== booking.totalAmount) {
    return NextResponse.json({ message: "Nominal pembayaran tidak cocok" }, { status: 400 });
  }

  let nextStatus = mapMidtransStatus(
    parsed.data.transaction_status,
    parsed.data.fraud_status,
  );
  if (
    booking.paymentStatus === "paid" &&
    (nextStatus.paymentStatus === "pending" || nextStatus.paymentStatus === "authorized")
  ) {
    nextStatus = { status: "confirmed", paymentStatus: "paid" };
  }
  const isPaid = nextStatus.paymentStatus === "paid";

  await db.transaction(async (transaction) => {
    await transaction.insert(paymentNotifications).values({
      bookingId: booking.id,
      transactionStatus: parsed.data.transaction_status,
      fraudStatus: parsed.data.fraud_status,
      payload,
    });

    await transaction
      .update(bookings)
      .set({
        ...nextStatus,
        midtransTransactionId: parsed.data.transaction_id,
        paidAt: isPaid ? booking.paidAt ?? new Date() : booking.paidAt,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking.id));
  });

  return NextResponse.json({ received: true });
}
