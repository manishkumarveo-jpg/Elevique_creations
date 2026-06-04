"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "The attention to detail and creative vision transformed our brand identity completely.",
    author: "Sarah Chen",
    role: "Creative Director",
    company: "Studio Forma",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    quote: "Working with them felt like a true creative partnership from day one.",
    author: "Marcus Webb",
    role: "Head of Design",
    company: "Minimal Co",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    quote: "They understand that great design is invisible yet unforgettable.",
    author: "Elena Voss",
    role: "Art Director",
    company: "Pixel & Co",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
  },
];

export default function TestimonialsEditorial() {
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleChange = (index: number) => {
    if (index === active || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActive(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handlePrev = () =>
    handleChange(active === 0 ? testimonials.length - 1 : active - 1);

  const handleNext = () =>
    handleChange(active === testimonials.length - 1 ? 0 : active + 1);

  const current = testimonials[active];

  return (
    <div className="te-wrap">
      {/* ── Quote row ──────────────────────────────────── */}
      <div className="te-quote-row">
        {/* Ghost number */}
        <span
          className="te-number"
          style={{ fontFeatureSettings: '"tnum"' }}
          aria-hidden="true"
        >
          {String(active + 1).padStart(2, "0")}
        </span>

        {/* Right column */}
        <div className="te-right">
          <blockquote
            className={`te-quote ${
              isTransitioning ? "te-quote--out" : "te-quote--in"
            }`}
          >
            {current.quote}
          </blockquote>

          {/* Author */}
          <div
            className={`te-author ${
              isTransitioning ? "te-author--out" : "te-author--in"
            }`}
          >
            <div className="te-avatar">
              <Image
                src={current.image}
                alt={current.author}
                fill
                sizes="52px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="te-name">{current.author}</p>
              <p className="te-role">
                {current.role}
                <span className="te-slash"> / </span>
                {current.company}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav bar ────────────────────────────────────── */}
      <div className="te-nav">
        {/* Dash indicators + counter */}
        <div className="te-nav-left">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleChange(index)}
              aria-label={`Testimonial ${index + 1}`}
              aria-current={index === active}
              className="te-dash-btn"
            >
              <span
                className={`te-dash ${index === active ? "te-dash--active" : ""}`}
              />
            </button>
          ))}
          <span className="te-counter">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

        {/* Arrows */}
        <div className="te-arrows">
          <button
            onClick={handlePrev}
            className="te-arrow"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="te-arrow"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
