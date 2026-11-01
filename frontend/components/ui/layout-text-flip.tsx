"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LayoutTextFlipProps {
  text?: string;
  words: string[];
  duration?: number;
  className?: string;
  textClassName?: string;
}

export const LayoutTextFlip: React.FC<LayoutTextFlipProps> = ({
  text = "",
  words,
  duration = 3000,
  className,
  textClassName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span className={cn("inline-flex flex-col sm:inline items-baseline", className)}>
      {text && <span className="inline mr-2 sm:mr-3">{text}</span>}
      <span className="relative inline-block overflow-hidden min-w-[280px] sm:min-w-[420px] lg:min-w-[500px] text-left">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[currentIndex]}
            initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 18,
              mass: 0.8,
            }}
            className={cn(
              "inline-block bg-gradient-to-r from-[#3C55F5] via-[#54D2B9] to-[#8A7AF0] bg-clip-text text-transparent font-black tracking-tight",
              textClassName
            )}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
};

