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
  duration = 3200,
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
    <span className={cn("inline-flex flex-col sm:inline items-center justify-center", className)}>
      {text && <span className="inline mr-2 sm:mr-3">{text}</span>}
      <span className="relative inline-block overflow-visible text-center sm:text-left">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[currentIndex]}
            initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -24, opacity: 0, filter: "blur(4px)" }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "inline-block bg-gradient-to-r from-[#3C55F5] via-[#4F6AF8] to-[#54D2B9] bg-clip-text text-transparent font-black tracking-tight",
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
