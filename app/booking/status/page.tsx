import { BookingStatus } from "./status";

export default async function BookingStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string | string[] }>;
}) {
  const { order_id: orderId } = await searchParams;

  return <BookingStatus orderId={typeof orderId === "string" ? orderId : ""} />;
}
