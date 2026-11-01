"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface FeatureRowProps {
  id?: string;
  pill: string;
  heading: string;
  description: string;
  bullets: string[];
  ctaText?: string;
  ctaHref?: string;
  imageOnLeft?: boolean;
  children: React.ReactNode;
}

export const FeatureRow: React.FC<FeatureRowProps> = ({
  id,
  pill,
  heading,
  description,
  bullets,
  ctaText,
  ctaHref,
  imageOnLeft = false,
  children,
}) => {
  return (
    <section id={id} className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
            imageOnLeft ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text Content Column */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 mb-4 border border-slate-200/60">
              {pill}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
              {heading}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
              {description}
            </p>

            <ul className="space-y-3 mb-8 w-full">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-slate-700 font-medium">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            {ctaText && ctaHref && (
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#3C55F5] hover:text-[#2D44E0] group py-1"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* Interactive Mockup / Visual Column */}
          <div className="w-full lg:w-1/2">{children}</div>
        </div>
      </div>
    </section>
  );
};

