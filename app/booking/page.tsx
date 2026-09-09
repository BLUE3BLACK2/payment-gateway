import { getStay } from "../stays";
import { BookingForm } from "./booking-form";

export default async function BookingPage({ searchParams }: PageProps<"/booking">) {
  const { stay: stayId } = await searchParams;
  const stay = getStay(typeof stayId === "string" ? stayId : undefined);

  return <BookingForm stay={stay} />;
}
