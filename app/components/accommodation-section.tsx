"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BedDouble, CircleParking, KeyRound, ShieldCheck, Sparkles, Star, Users, Wifi } from "lucide-react";
import { useState } from "react";

const categories = ["Villa", "Apartments", "Mansion", "Cottage"] as const;
type Category = (typeof categories)[number];
type Stay = { name: string; location: string; description: string; price: number; rating: string; image: string; rooms: string; bathrooms: string };

const catalog: Record<Category, Stay[]> = {
  Villa: [
    { name: "Sora Pool Villa", location: "Ubud, Bali", description: "A sunlit private retreat made for slow mornings and restorative stays.", price: 140, rating: "4.9", image: "/accommodations/villa.webp", rooms: "1 king + 2", bathrooms: "3 ensuite" },
    { name: "Awan Garden Villa", location: "Canggu, Bali", description: "A quiet garden hideaway with warm timber details and a private pool.", price: 165, rating: "4.8", image: "/accommodations/cottage.webp", rooms: "2 king", bathrooms: "2 ensuite" },
  ],
  Apartments: [
    { name: "Lume City Suite", location: "Seminyak, Bali", description: "A calm, design-led city base within easy reach of dining and the coast.", price: 120, rating: "4.8", image: "/accommodations/apartment.webp", rooms: "1 king", bathrooms: "1 ensuite" },
    { name: "Nusa Loft", location: "Sanur, Bali", description: "Airy open-plan living with thoughtful comforts for an effortless escape.", price: 135, rating: "4.7", image: "/accommodations/villa.webp", rooms: "1 king + 1", bathrooms: "2 baths" },
  ],
  Mansion: [
    { name: "Maison Aruna", location: "Uluwatu, Bali", description: "Heritage character and generous rooms for memorable group getaways.", price: 310, rating: "4.9", image: "/accommodations/mansion.webp", rooms: "4 king", bathrooms: "5 ensuite" },
    { name: "The Olive House", location: "Nusa Dua, Bali", description: "A gracious estate pairing classic details with modern island ease.", price: 360, rating: "5.0", image: "/accommodations/cottage.webp", rooms: "5 king", bathrooms: "5 ensuite" },
  ],
  Cottage: [
    { name: "Meadow Cottage", location: "Sidemen, Bali", description: "A tactile countryside stay surrounded by green hills and quiet trails.", price: 110, rating: "4.9", image: "/accommodations/cottage.webp", rooms: "1 king", bathrooms: "1 bath" },
    { name: "Riverstone Cabin", location: "Munduk, Bali", description: "A cozy timber refuge with cool mountain air and forest views.", price: 125, rating: "4.8", image: "/accommodations/mansion.webp", rooms: "2 queen", bathrooms: "2 baths" },
  ],
};

function StayCard({ stay, previous, next }: { stay: Stay; previous: () => void; next: () => void }) {
  const stayId = stay.name.toLowerCase().replaceAll(" ", "-");
  return (
    <article className="accommodation-card">
      <div className="stay-image-wrap"><Image src={stay.image} alt={stay.name} fill sizes="(max-width: 700px) 100vw, 34vw" className="stay-image" /><span className="accommodation-rating"><Star size={13} fill="currentColor" /> {stay.rating}</span></div>
      <div className="stay-overview">
        <div><p className="accommodation-eyebrow">{stay.location}</p><h2>{stay.name}</h2><p className="stay-description">{stay.description}</p></div>
        <div className="stay-overview-footer"><button className="host-link" type="button"><Users size={15} /> Meet the host</button><div className="card-arrows"><button type="button" onClick={previous} aria-label="Previous stay"><ArrowLeft size={18} /></button><button type="button" onClick={next} aria-label="Next stay"><ArrowRight size={18} /></button></div></div>
      </div>
      <div className="stay-details">
        <div><strong className="stay-price">${stay.price}<span>/night</span></strong><p className="price-note">Including all taxes</p></div>
        <div className="information"><p className="information-title">Basic information</p><dl><div><dt><BedDouble size={15} /> Rooms</dt><dd>{stay.rooms}</dd></div><div><dt><KeyRound size={15} /> Bathrooms</dt><dd>{stay.bathrooms}</dd></div><div><dt><Wifi size={15} /> Internet</dt><dd>100 Mbps</dd></div><div><dt><CircleParking size={15} /> Parking</dt><dd>Included</dd></div></dl></div>
      </div>
      <div className="stay-action"><div className="benefit"><Sparkles size={22} /><div><strong>Cleanliness</strong><p>Daily care and fresh linen are included.</p></div></div><div className="benefit"><ShieldCheck size={22} /><div><strong>Amenities</strong><p>Essential comforts are ready on arrival.</p></div></div><Link className="book-button" href={`/booking?stay=${stayId}`}>Book now <ArrowRight size={16} /></Link></div>
    </article>
  );
}

export function AccommodationSection() {
  const [category, setCategory] = useState<Category>("Villa");
  const [indices, setIndices] = useState([0, 1]);
  const options = catalog[category];
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
