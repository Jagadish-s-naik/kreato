"use client";

import React from "react";
import { RotateCw, Clock, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface FeedItem {
  id: string;
  time: string;
  type: "money_risk" | "overdue_invoice" | "memo_accepted";
  title: string;
  subtitle: string;
  badge: string;
  badgeStyle: string;
  actionText?: string;
  actionHref?: string;
}

export const ActivityFeed: React.FC = () => {
  const items: FeedItem[] = [
    {
      id: "f_01",
      time: "Today 10:15 am",
      type: "money_risk",
      title: "GlowSkin India Offer Detected",
      subtitle: "₹1,25,000 at risk via perpetual rights & 60-day delay terms.",
      badge: "Money Leak",
      badgeStyle: "bg-pastel-coral text-red-900",
      actionText: "Run Radar",
      actionHref: "/deals/deal_01",
    },
    {
      id: "f_02",
      time: "Today 09:30 am",
      type: "overdue_invoice",
      title: "Invoice KR/2026-27/011 is Overdue",
      subtitle: "GlowSkin India ₹35,400 due 17 days ago.",
      badge: "17 Days Late",
      badgeStyle: "bg-amber-100 text-amber-900",
      actionText: "Draft Reminder",
      actionHref: "/invoices",
    },
    {
      id: "f_03",
      time: "Yesterday",
      type: "memo_accepted",
      title: "Plum Goodness Accepted Terms",
      subtitle: "Deal memo DS-884 signed for ₹45,000. Ready to invoice.",
      badge: "Agreed",
      badgeStyle: "bg-pastel-lime text-emerald-900",
      actionText: "Generate Invoice",
      actionHref: "/invoices",
    },
  ];

  return (
    <aside className="w-72 flex flex-col gap-3.5 py-1 select-none shrink-0">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-gray-900 tracking-tight uppercase tracking-wider text-gray-500">
          Live Commercial Stream
        </h2>
        <button
          className="p-1 text-gray-400 hover:text-gray-700 rounded-full transition-all"
          title="Refresh Feed"
        >
          <RotateCw className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto pr-0.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-3.5 shadow-card border border-gray-100/80 transition-transform hover:-translate-y-0.5 duration-150"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badgeStyle}`}
              >
                {item.badge}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" /> {item.time}
              </span>
            </div>

            <h4 className="text-xs font-bold text-gray-900 leading-snug">
              {item.title}
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
              {item.subtitle}
            </p>

            {item.actionText && item.actionHref && (
              <div className="mt-2.5 pt-2 border-t border-gray-100 flex justify-end">
                <Link
                  href={item.actionHref}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
