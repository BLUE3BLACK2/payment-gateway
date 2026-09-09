"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "./components/brand-logo";
import { stays } from "./stays";

const featuredStays = Object.values(stays).flat();

const slides = [
  { src: "/images/stay-bedroom.webp", alt: "A sunlit bedroom at Kaia House" },
  { src: "/images/stay-living.webp", alt: "A calm living room overlooking the coast" },
  { src: "/images/stay-courtyard.webp", alt: "A private suite opening to a garden" },
];

function ArrowButton({ label, href }: { label: string; href: string }) {
  return <Link className="arrow-button" href={href} aria-label={label}><ArrowUpRight size={16} strokeWidth={2.2} /></Link>;
}

function StayCard({ stay }: { stay: (typeof featuredStays)[number] }) {
  return (
    <article className="stay-card">
      <div className="stay-card-image">
        <Image src={stay.image} alt={stay.type} fill sizes="(max-width: 720px) 88vw, 25vw" />
        <ArrowButton label={`Book ${stay.name}`} href={`/booking?stay=${stay.id}`} />
      </div>
      <div className="stay-card-meta"><div><strong>{stay.type}</strong><span>{stay.location}</span></div><Link href={`/booking?stay=${stay.id}`}>Book now</Link></div>
    </article>
  );
}

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="page-shell">
      <header className="site-header">
        <BrandLogo />
        <nav aria-label="Main navigation"><a href="#stays">Stays</a><a href="#story">Our story</a><a href="#journal">Journal</a></nav>
        <div className="header-actions"><a className="text-link" href="#stays">Explore stays</a><Link className="button button-dark" href="/booking">Book now <ArrowUpRight size={15} /></Link><button className="menu-button" type="button" aria-label="Open menu"><Menu size={20} /></button></div>
      </header>

      <section className="hero-grid" id="story">
        <div className="hero-copy">
          <div className="rating"><Star size={25} fill="currentColor" /><span><strong>4.9</strong> guest rating</span></div>
          <h1>Find your<br />best stay.</h1>
          <p>Thoughtful spaces, unhurried mornings, and the kind of quiet you remember. Discover private stays made for slowing down.</p>
          <div className="hero-actions"><a className="button button-light" href="#stays">View stays</a><Link className="button button-dark" href={`/booking?stay=${featuredStays[activeSlide].id}`}>Book this stay <ArrowUpRight size={15} /></Link></div>
          <div className="trusted"><span>Trusted by travellers from</span><div><strong>Kinfolk</strong><strong>airbnb</strong><strong>Condé Nast</strong></div></div>
        </div>

        <div className="hero-visual" aria-live="polite">
          {slides.map((slide, index) => <Image key={slide.src} className={index === activeSlide ? "hero-image is-active" : "hero-image"} src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="(max-width: 900px) 94vw, 58vw" />)}
          <div className="image-shade" />
          <div className="image-caption"><span>Featured stay</span><strong>{["Kaia House", "Nara Coast", "Sora Garden"][activeSlide]}</strong></div>
          <div className="slide-progress" key={activeSlide}><span /></div>
        </div>
      </section>

      <section className="stay-grid" id="stays" aria-label="Featured stays">
        <StayCard stay={featuredStays[0]} />
        <StayCard stay={featuredStays[1]} />
        <article className="explore-card">
          <div className="explore-copy"><span className="eyebrow">Private stays, your pace</span><h2>A better way to find somewhere worth staying.</h2><a href="#accommodation">Explore all stays <ArrowUpRight size={16} /></a></div>
          <div className="explore-image"><Image src={featuredStays[2].image} alt={featuredStays[2].name} fill sizes="(max-width: 720px) 88vw, 25vw" /><ArrowButton label={`Book ${featuredStays[2].name}`} href={`/booking?stay=${featuredStays[2].id}`} /></div>
        </article>
      </section>
    </main>
  );
}
