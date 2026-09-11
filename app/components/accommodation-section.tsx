"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BedDouble, CircleParking, KeyRound, ShieldCheck, Sparkles, Star, Users, Wifi } from "lucide-react";
import { useState } from "react";
import { categories, formatPrice, stays, type Category, type Stay } from "../stays";

function StayCard({ stay, previous, next }: { stay: Stay; previous: () => void; next: () => void }) {
  return (
    <article className="accommodation-card">
      <div className="stay-image-wrap"><Image src={stay.image} alt={stay.name} fill sizes="(max-width: 700px) 100vw, 34vw" className="stay-image" /><span className="accommodation-rating"><Star size={13} fill="currentColor" /> {stay.rating}</span></div>
      <div className="stay-overview">
        <div><p className="accommodation-eyebrow">{stay.location}</p><h2>{stay.name}</h2><p className="stay-description">{stay.description}</p></div>
        <div className="stay-overview-footer"><button className="host-link" type="button"><Users size={15} /> Meet the host</button><div className="card-arrows"><button type="button" onClick={previous} aria-label="Previous stay"><ArrowLeft size={18} /></button><button type="button" onClick={next} aria-label="Next stay"><ArrowRight size={18} /></button></div></div>
      </div>
      <div className="stay-details">
        <div><strong className="stay-price">{formatPrice(stay.price)}<span>/night</span></strong><p className="price-note">Including all taxes</p></div>
        <div className="information"><p className="information-title">Basic information</p><dl><div><dt><BedDouble size={15} /> Rooms</dt><dd>{stay.rooms}</dd></div><div><dt><KeyRound size={15} /> Bathrooms</dt><dd>{stay.bathrooms}</dd></div><div><dt><Wifi size={15} /> Internet</dt><dd>100 Mbps</dd></div><div><dt><CircleParking size={15} /> Parking</dt><dd>Included</dd></div></dl></div>
      </div>
      <div className="stay-action"><div className="benefit"><Sparkles size={22} /><div><strong>Cleanliness</strong><p>Daily care and fresh linen are included.</p></div></div><div className="benefit"><ShieldCheck size={22} /><div><strong>Amenities</strong><p>Essential comforts are ready on arrival.</p></div></div><Link className="book-button" href={`/booking?stay=${stay.id}`}>Book now <ArrowRight size={16} /></Link></div>
    </article>
  );
}

export function AccommodationSection() {
  const [category, setCategory] = useState<Category>("Villa");
  const [indices, setIndices] = useState([0, 1]);
  const options = stays[category];
  const choose = (item: Category) => { setCategory(item); setIndices([0, 1]); };
  const move = (row: number, direction: number) => setIndices((items) => items.map((index, position) => position === row ? (index + direction + options.length) % options.length : index));
  return (
    <section className="accommodation-section" id="accommodation"><div className="section-shell">
      <header className="accommodation-heading"><p className="section-kicker">Curated places to stay</p><h1>accommodation</h1><p>Thoughtful spaces for every kind of escape.</p></header>
      <div className="category-tabs" role="tablist" aria-label="Accommodation categories">{categories.map((item) => <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? "active" : ""} onClick={() => choose(item)}>{item}</button>)}</div>
      <div className="stay-list" aria-live="polite">{indices.map((index, row) => <StayCard key={`${category}-${row}-${index}`} stay={options[index]} previous={() => move(row, -1)} next={() => move(row, 1)} />)}</div>
    </div></section>
  );
}
