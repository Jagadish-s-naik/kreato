"use client";

import React from "react";
import {
  RotateCw,
  AlertTriangle,
  Receipt,
  FileText,
  ExternalLink,
  PhoneCall,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface FeedItem {
  id: string;
  time: string;
  type: "money_risk" | "overdue_invoice" | "new_inquiry" | "memo_accepted";
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
      subtitle: "₹1,25,000 at risk via perpetual rights & 60-day delay.",
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
    <aside className="w-80 flex flex-col gap-4 py-2 pl-2 pr-1 select-none shrink-0">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">
          Creator Live Feed
        </h2>
        <button
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-all"
          title="Refresh Feed"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3.5 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative pl-5 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200"
          >
            <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-400" />
            <div className="text-[10px] font-medium text-gray-400 mb-1.5">
              {item.time}
            </div>

            <div className="bg-white rounded-3xl p-3.5 shadow-card border border-gray-100">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badgeStyle}`}
                >
                  {item.badge}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> Real-time
                </span>
              </div>

              <h4 className="text-xs font-bold text-gray-900 leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                {item.subtitle}
              </p>

              {item.actionText && item.actionHref && (
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
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
          </div>
        ))}
      </div>
    </aside>
  );
};

