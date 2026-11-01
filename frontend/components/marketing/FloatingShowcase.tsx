"use client";

import React from "react";
import { motion } from "framer-motion";

export const FloatingShowcase: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-6 mb-20 px-4 flex justify-center items-center">
      {/* Central Phone Device Frame */}
      <div className="relative z-20 w-[280px] sm:w-[320px] md:w-[350px] rounded-[48px] p-2.5 bg-slate-900 shadow-[0_30px_70px_rgba(0,0,0,0.22)] border-[4px] border-slate-800">
        <div className="relative rounded-[40px] overflow-hidden bg-white aspect-[9/18.5]">
          {/* Real Extracted Mobile Showcase Screen */}
          <img
            src="/marketing/c7128864-65d3-4038-a49f-5376a349383a.png"
            alt="Kreato Creator Business Mobile Workspace"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* FLOATING CARD 1 (Top Left) - Beam / Got You Paid Notification */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-2, -1, -2] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 left-0 sm:-left-8 md:-left-16 z-30 max-w-[210px] sm:max-w-[250px] rounded-2xl shadow-2xl transition-transform"
      >
        <img
          src="/marketing/ZxyAumx2JWOyLWCHRhqIEoA2Mw4.webp"
          alt="Payment Received Card"
          className="w-full h-auto drop-shadow-xl"
        />
      </motion.div>

      {/* FLOATING CARD 2 (Top Right) - Handled Today Checklist */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [2, 1, 2] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2 right-0 sm:-right-8 md:-right-16 z-30 max-w-[210px] sm:max-w-[250px] rounded-2xl shadow-2xl transition-transform"
      >
        <img
          src="/marketing/8dQut5ULGTXC2AGiB6URrrUy4.webp"
          alt="Copilot Activity Checklist"
          className="w-full h-auto drop-shadow-xl"
        />
      </motion.div>

      {/* FLOATING CARD 3 (Bottom Left) - Pattern Noticed Mini Chart */}
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [-1, -2, -1] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-2 sm:-left-6 md:-left-12 z-30 max-w-[200px] sm:max-w-[240px] rounded-2xl shadow-2xl transition-transform"
      >
        <img
          src="/marketing/QNsZyW7ITCMGzjeVb2b8irg0EvI.webp"
          alt="Money Leak Pattern Mini Chart"
          className="w-full h-auto drop-shadow-xl"
        />
      </motion.div>

      {/* FLOATING CARD 4 (Bottom Right) - Over Text Chat Action */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [1, 2, 1] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-2 sm:-right-6 md:-right-12 z-30 max-w-[200px] sm:max-w-[240px] rounded-2xl shadow-2xl transition-transform"
      >
        <img
          src="/marketing/NMjT20biH8Dd6626izmxVC3WrA.webp"
          alt="Copilot Action Notification"
          className="w-full h-auto drop-shadow-xl"
        />
      </motion.div>
    </div>
  );
};
