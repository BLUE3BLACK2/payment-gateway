"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  ChevronDown,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { formatPrice, type Stay } from "../stays";
import { BrandLogo } from "../components/brand-logo";

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "booking-field is-wide" : "booking-field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function BookingForm({
  stay,
  midtransClientKey,
  isProduction,
}: {
  stay: Stay;
  midtransClientKey: string;
  isProduction: boolean;
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [paymentState, setPaymentState] = useState<"idle" | "creating" | "paying">("idle");
  const [error, setError] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const difference = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.ceil(difference / 86400000));
  }, [checkIn, checkOut]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPaymentState("creating");

    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").replace(/[^0-9]/g, "");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accommodationId: stay.id,
          guestName: `${firstName} ${lastName}`.trim(),
          guestEmail: form.get("email"),
          guestPhone: `+62${phone.replace(/^0/, "")}`,
          checkIn,
          checkOut,
          guestCount: guests,
          notes: form.get("notes"),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Booking belum dapat dibuat");
      }

      const statusUrl = `/booking/status?order_id=${encodeURIComponent(result.orderId)}`;
      if (!window.snap) {
        window.location.assign(result.redirectUrl);
        return;
      }

      setPaymentState("paying");
      window.snap.pay(result.snapToken, {
        onSuccess: () => router.push(statusUrl),
        onPending: () => router.push(statusUrl),
        onError: () => {
          setError("Pembayaran gagal diproses. Silakan coba kembali.");
          setPaymentState("idle");
        },
        onClose: () => {
          setError("Jendela pembayaran ditutup. Booking Anda ditahan selama 30 menit.");
          setPaymentState("idle");
        },
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Terjadi kesalahan. Silakan coba kembali.",
      );
      setPaymentState("idle");
    }
  };

  return (
    <main className="booking-page">
      <Script
        src={isProduction ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
        data-client-key={midtransClientKey}
        strategy="afterInteractive"
      />
      <section className="booking-shell">
        <aside className="booking-stay-panel">
          <div className="booking-brand-row">
            <BrandLogo inverse />
            <Link className="back-link" href="/"><ArrowLeft size={15} /> Back to stays</Link>
          </div>

          <div className="selected-stay-copy">
            <span className="booking-eyebrow">Your selected stay</span>
            <h1>A quiet escape,<br />reserved for you.</h1>
            <p>Share a few details and we’ll take care of everything else.</p>
          </div>

          <article className="selected-stay-card">
            <div className="selected-stay-image">
              <Image src={stay.image} alt={stay.name} fill priority sizes="(max-width: 900px) 92vw, 38vw" />
              <span>{stay.type}</span>
            </div>
            <div className="selected-stay-details">
              <div><h2>{stay.name}</h2><p><MapPin size={14} /> {stay.location}</p></div>
              <strong>{formatPrice(stay.price)} <small>/ night</small></strong>
            </div>
            <div className="stay-facts">
              <span><Users size={15} /> Up to {stay.guests} guests</span>
              <span><BedDouble size={15} /> {stay.rooms}</span>
              <span><Sparkles size={15} /> {stay.size} m² private space</span>
            </div>
          </article>

          <div className="booking-assurance"><ShieldCheck size={18} /><span><strong>Book with confidence</strong>Free cancellation up to 7 days before arrival.</span></div>
        </aside>

        <div className="booking-form-panel">
          <div className="booking-progress" aria-label="Booking progress">
            <div className="is-active"><span>1</span><small>Your details</small></div>
            <i />
            <div><span>2</span><small>Payment</small></div>
            <i />
            <div><span>3</span><small>Confirmed</small></div>
          </div>

          <div className="form-heading">
            <span className="booking-eyebrow">Step 1 of 3</span>
            <h2>Tell us about your stay</h2>
            <p>We’ll use these details to prepare your reservation.</p>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="booking-form-grid">
              <Field label="Check-in"><div className="input-wrap"><CalendarDays size={17} /><input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} required /></div></Field>
              <Field label="Check-out"><div className="input-wrap"><CalendarDays size={17} /><input type="date" value={checkOut} min={checkIn} onChange={(event) => setCheckOut(event.target.value)} required /></div></Field>
              <Field label="Guests" wide><div className="input-wrap"><Users size={17} /><select value={guests} onChange={(event) => setGuests(event.target.value)}>{Array.from({ length: stay.guests }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} guest{index ? "s" : ""}</option>)}</select><ChevronDown className="select-chevron" size={16} /></div></Field>
            </div>

            <div className="form-divider"><span>Guest information</span></div>

            <div className="booking-form-grid">
              <Field label="First name"><input name="firstName" type="text" placeholder="e.g. Alex" autoComplete="given-name" required /></Field>
              <Field label="Last name"><input name="lastName" type="text" placeholder="e.g. Morgan" autoComplete="family-name" required /></Field>
              <Field label="Email address" wide><input name="email" type="email" placeholder="alex@example.com" autoComplete="email" required /></Field>
              <Field label="Phone number" wide><div className="phone-input"><span>+62</span><input name="phone" type="tel" placeholder="812 3456 7890" autoComplete="tel" required /></div></Field>
              <Field label="Anything we should know? (optional)" wide><textarea name="notes" rows={3} placeholder="Arrival time, celebration, dietary needs..." /></Field>
            </div>

            <div className="booking-total">
              <div><span>{formatPrice(stay.price)} × {nights} night{nights > 1 ? "s" : ""}</span><small>{guests} guest{guests !== "1" ? "s" : ""} · Taxes included</small></div>
              <strong>{formatPrice(stay.price * nights)}</strong>
            </div>

            {error && <div className="form-error" role="alert">{error}</div>}

            <button className="booking-submit" type="submit" disabled={paymentState !== "idle"}>{paymentState === "creating" ? "Preparing payment..." : paymentState === "paying" ? "Opening payment..." : "Continue to payment"} <ArrowRight size={17} /></button>
            <p className="form-footnote"><ShieldCheck size={14} /> Your information is securely protected.</p>
          </form>
        </div>
      </section>
    </main>
  );
}
