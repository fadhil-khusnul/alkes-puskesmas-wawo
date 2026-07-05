"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface LandingHeroProps {
  slidesJson: string;
  fallbackHeadline: string;
  fallbackSubheadline: string;
}

export default function LandingHero({
  slidesJson,
  fallbackHeadline,
  fallbackSubheadline,
}: LandingHeroProps) {
  const defaultSlides: Slide[] = [
    {
      image: "/images/hero1.png",
      title: "Digitalisasi Pengelolaan Alat Medis",
      subtitle: "Puskesmas Wawo, Kabupaten Bima",
    },
    {
      image: "/images/hero2.png",
      title: "Akurasi Pencatatan & Keamanan",
      subtitle: "Sistem Informasi Terkomputerisasi untuk Tenaga Medis",
    },
    {
      image: "/images/hero3.png",
      title: "Pelayanan Kesehatan Optimal",
      subtitle: "Mendukung pencegahan risiko infeksi dan pencemaran",
    },
  ];

  let slides = defaultSlides;
  try {
    if (slidesJson) {
      slides = JSON.parse(slidesJson);
    }
  } catch (e) {
    console.error("Error parsing hero slides JSON", e);
  }

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[6000ms] ease-out"
            style={{
              backgroundImage: `url('${slide.image}')`,
              transform: idx === current ? "scale(1)" : "scale(1.05)",
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/75 to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full text-white">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 border border-teal-400/30 text-teal-300 uppercase tracking-widest animate-pulse">
              Puskesmas Wawo • Kabupaten Bima
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-none text-white drop-shadow-sm">
              {slides[current]?.title || fallbackHeadline}
            </h1>
            <p className="text-base md:text-xl text-slate-300 leading-relaxed max-w-2xl font-light">
              {slides[current]?.subtitle || fallbackSubheadline}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 focus:outline-none"
              >
                Masuk ke Sistem
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-10 right-10 z-20 flex items-center gap-2">
        <button
          onClick={prevSlide}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors duration-200 border border-white/10 focus:outline-none"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors duration-200 border border-white/10 focus:outline-none"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 left-10 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? "w-8 bg-teal-400" : "w-2 bg-white/30"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
