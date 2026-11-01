"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

export const MarketingNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Product", href: "#showcase" },
    { label: "Features", href: "#features" },
    { label: "AI Copilot", href: "#copilot" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-4 sm:pt-6 pointer-events-none transition-all duration-300">
      <div
        className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border border-slate-200/60"
            : "bg-white/95 backdrop-blur-md shadow-sm border border-slate-200/50"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/kreato-logo.png"
              alt="Kreato logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            Kreato
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-slate-900 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-slate-950 px-3.5 py-2 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-[#3C55F5] hover:bg-[#2D44E0] active:scale-[0.98] px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>Start for free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/signup"
            className="text-xs font-semibold text-white bg-[#3C55F5] px-3 py-1.5 rounded-full"
          >
            Start free
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-200/80 sm:hidden pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#3C55F5] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-[#3C55F5] text-white font-semibold shadow-sm"
              >
                Start for free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

