import type { InferSelectModel } from "drizzle-orm";
import type { bookings } from "@/db/schema";

type Booking = InferSelectModel<typeof bookings>;

export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string,
): Pick<Booking, "status" | "paymentStatus"> {
  if (
    transactionStatus === "settlement" ||
    (transactionStatus === "capture" && fraudStatus === "accept")
  ) {
    return { status: "confirmed", paymentStatus: "paid" };
  }

  if (transactionStatus === "capture" || transactionStatus === "authorize") {
    return { status: "pending", paymentStatus: "authorized" };
  }

  if (transactionStatus === "deny") {
    return { status: "cancelled", paymentStatus: "denied" };
  }

  if (transactionStatus === "cancel") {
    return { status: "cancelled", paymentStatus: "cancelled" };
  }

  if (transactionStatus === "expire") {
    return { status: "expired", paymentStatus: "expired" };
  }

  if (transactionStatus === "refund") {
    return { status: "cancelled", paymentStatus: "refunded" };
  }

  if (transactionStatus === "partial_refund") {
    return { status: "confirmed", paymentStatus: "partial_refund" };
  }

  return { status: "pending", paymentStatus: "pending" };
}
