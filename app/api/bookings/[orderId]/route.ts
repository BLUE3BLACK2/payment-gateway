import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.orderId, orderId),
    columns: {
      orderId: true,
      accommodationId: true,
      checkIn: true,
      checkOut: true,
      totalAmount: true,
      status: true,
      paymentStatus: true,
      expiresAt: true,
      paidAt: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ message: "Booking tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(booking);
}
