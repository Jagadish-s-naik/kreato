"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export const StickyBottomCta: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after user scrolls past the hero section (approx 450px)
      if (window.scrollY > 450 && !dismissed) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-40 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-slate-900">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center shrink-0">
            <img
              src="/kreato-logo.png"
              alt="Kreato"
              className="w-5 h-5 object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-900 truncate">
              Ready to bring your creator business together?
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              Zero commission. Protect your income today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#3D54F5] hover:bg-[#3047DE] active:scale-95 px-3.5 py-2 rounded-xl shadow-xs transition-all"
          >
            <span>Start for free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

