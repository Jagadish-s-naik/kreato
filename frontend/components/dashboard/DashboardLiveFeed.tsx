"use client";

import React from "react";
import { RotateCw, Clock, ArrowRight, ShieldAlert, Receipt, FileCheck } from "lucide-react";
import Link from "next/link";

interface DashboardEvent {
  id: string;
  time: string;
  date: string;
  type: "money_risk" | "overdue_invoice" | "terms_accepted";
  badge: string;
  badgeStyle: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export const DashboardLiveFeed: React.FC = () => {
  const events: DashboardEvent[] = [
    {
      id: "ev_01",
      date: "Tu, 25.03",
      time: "1:23 pm",
      type: "money_risk",
      badge: "Money Leak",
      badgeStyle: "bg-[#F1B4B9]/30 text-[#702228] border border-[#F1B4B9]/60",
      title: "GlowSkin India Offer Detected",
      description: "₹1,25,000 at risk via perpetual rights and 60-day delay terms.",
      actionLabel: "Run Radar →",
      actionHref: "/deals/deal_01",
    },
    {
      id: "ev_02",
      date: "Tu, 25.03",
      time: "11:09 am",
      type: "overdue_invoice",
      badge: "17 Days Late",
      badgeStyle: "bg-amber-100 text-amber-900 border border-amber-200",
      title: "Invoice KR/2026-27/011 Overdue",
      description: "GlowSkin India ₹35,400 overdue. Creator financing costs accumulating.",
      actionLabel: "Draft Reminder →",
      actionHref: "/invoices",
    },
    {
      id: "ev_03",
      date: "Mo, 24.03",
      time: "08:56 am",
      type: "terms_accepted",
      badge: "Agreed",
      badgeStyle: "bg-[#DAF4AA]/40 text-[#2D4B13] border border-[#DAF4AA]/80",
      title: "Plum Goodness Accepted Terms",
      description: "Deal memo DS-884 signed for ₹45,000. Ready to issue GST invoice.",
      actionLabel: "Generate Invoice →",
      actionHref: "/invoices",
    },
  ];

  return (
    <aside className="w-full xl:w-[310px] flex flex-col gap-4 select-none shrink-0">
      {/* Header (Matching Realty Hub Image 2) */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">
          Creator Live Feed
        </h2>
        <button
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-all border border-transparent hover:border-[#EAF2F4]"
          title="Refresh Feed"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Connected Vertical Timeline */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-[#EAF2F4]"
          >
            {/* Timeline Circle Marker */}
            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            </div>

            {/* Timestamp label beside marker */}
            <div className="text-[10px] text-gray-400 mb-1.5 font-medium leading-none">
              {event.date} • {event.time}
            </div>

            {/* Individual Event Card */}
            <div className="bg-white rounded-2xl p-4 shadow-card border border-[#EAF2F4] hover:border-gray-300 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${event.badgeStyle}`}
                >
                  {event.badge}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> Live
                </span>
              </div>

              <h3 className="text-xs font-bold text-gray-900 leading-snug">
                {event.title}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                {event.description}
              </p>

              {/* Action Button */}
              <div className="mt-3 pt-2.5 border-t border-[#EAF2F4] flex justify-end">
                <Link
                  href={event.actionHref}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{event.actionLabel}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

