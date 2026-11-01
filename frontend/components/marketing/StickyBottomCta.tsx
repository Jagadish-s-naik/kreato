"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const StickyBottomCta: React.FC = () => {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after user scrolls down past the hero
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().replace(/^@/, "");
    if (clean) {
      router.push(`/signup?handle=${encodeURIComponent(clean)}`);
    } else {
      router.push("/signup");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-300">
      <form
        onSubmit={handleClaim}
        className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full p-2 pl-4 sm:pl-6 shadow-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-lg w-full"
      >
        <div className="flex items-center gap-2 w-full text-slate-900 font-semibold text-sm">
          <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center shrink-0">
            <img
              src="/kreato-logo.png"
              alt="Kreato"
              className="w-4 h-4 object-contain"
            />
          </div>
          <span className="font-bold text-slate-900 whitespace-nowrap">kreato.in/</span>
          <input
            type="text"
            placeholder="yourname"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full bg-transparent focus:outline-none placeholder:text-slate-400 text-slate-900 font-bold text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto shrink-0 bg-[#2C52F5] hover:bg-[#2042D8] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl sm:rounded-full shadow-sm transition-all whitespace-nowrap"
        >
          Claim your username
        </button>
      </form>
    </div>
  );
};
