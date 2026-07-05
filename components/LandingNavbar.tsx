"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Stethoscope, LogIn } from "lucide-react";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-4 text-slate-800 border-b border-slate-100"
          : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 focus:outline-none">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition-colors duration-300 ${
            isScrolled ? "bg-teal-600 shadow-sm" : "bg-teal-500 shadow-teal-500/20 shadow-lg"
          }`}>
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-lg block leading-none">
              Puskesmas Wawo
            </span>
            <span className={`text-[10px] uppercase tracking-wider block font-semibold mt-0.5 ${
              isScrolled ? "text-slate-500" : "text-teal-200"
            }`}>
              Sistem Alat Medis
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className={`flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${
              isScrolled
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-white text-teal-700 hover:bg-teal-50 hover:text-teal-800"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Masuk Ke Sistem
          </Link>
        </div>
      </div>
    </nav>
  );
}
