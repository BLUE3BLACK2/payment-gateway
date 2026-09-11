"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, Home, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/app/stays";

type BookingResult = {
  orderId: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "expired";
  paymentStatus: string;
};

export function BookingStatus({ orderId }: { orderId: string }) {
  const [booking, setBooking] = useState<BookingResult>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    let active = true;
    const load = async () => {
      try {
        const response = await fetch(`/api/bookings/${encodeURIComponent(orderId)}`, {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        if (active) setBooking(result);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Status belum dapat dimuat.");
        }
      }
    };

    load();
    const interval = window.setInterval(load, 3000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [orderId]);

  const confirmed = booking?.status === "confirmed";
  const failed = booking?.status === "cancelled" || booking?.status === "expired";
  const visibleError = orderId ? error : "Nomor booking tidak ditemukan.";

  return (
    <main className="status-page">
      <section className="status-card">
        <div className={`status-icon ${confirmed ? "is-success" : failed ? "is-failed" : "is-pending"}`}>
          {confirmed ? <CheckCircle2 size={42} /> : failed ? <XCircle size={42} /> : <Clock3 size={42} />}
        </div>
        <span className="booking-eyebrow">Payment status</span>
        <h1>{confirmed ? "Your stay is confirmed" : failed ? "Payment was not completed" : "We’re confirming your payment"}</h1>
        <p>{confirmed ? "Your reservation is ready. We’ll see you soon." : failed ? "You can return to the stays page and create a new booking." : "This page updates automatically after Midtrans sends the payment result."}</p>
        {booking && <div className="status-summary"><span>Order ID <strong>{booking.orderId}</strong></span><span>Total <strong>{formatPrice(booking.totalAmount)}</strong></span><span>Status <strong>{booking.paymentStatus}</strong></span></div>}
        {visibleError && <div className="form-error" role="alert">{visibleError}</div>}
        <Link className="button button-dark" href="/"><Home size={16} /> Back to stays</Link>
      </section>
    </main>
  );
}
