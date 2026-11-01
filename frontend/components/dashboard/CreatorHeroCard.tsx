"use client";

import React, { useEffect, useState } from "react";
import { Share2, Edit2, ShieldCheck, MapPin, Building2 } from "lucide-react";
import Link from "next/link";

export const CreatorHeroCard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [dealStats, setDealStats] = useState({ count: 0, totalPaise: 0 });

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, dRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/deals"),
        ]);
        if (pRes.ok) {
          const pJson = await pRes.json();
          if (pJson.success && pJson.data) {
            setProfile(pJson.data);
          }
        }
        if (dRes.ok) {
          const dJson = await dRes.json();
          if (dJson.success && dJson.data?.deals) {
            const deals = dJson.data.deals;
            const total = deals.reduce((sum: number, d: any) => sum + (d.fee_paise || 0), 0);
            setDealStats({ count: deals.length, totalPaise: total });
          }
        }
      } catch (e) {
        // Fallback
      }
    }
    loadData();
  }, []);

  const displayName = profile?.display_name || profile?.email?.split("@")[0] || "Creator";
  const handle = profile?.handle || `@${profile?.email?.split("@")[0] || "creator"}`;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedIncome = dealStats.totalPaise > 0
    ? `₹${(dealStats.totalPaise / 100).toLocaleString("en-IN")}`
    : "₹0";

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-[#EAF2F4]">
      {/* Top Row: Avatar, Identity & Quick Action Icons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#EAF2F4]">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center ring-2 ring-indigo-50 shadow-sm">
              {initials}
            </div>
            <span
              className="absolute -bottom-1 -right-1 p-1 bg-[#000305] text-[#DAF4AA] rounded-lg shadow-xs"
              title="Income Shield Active"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
                {displayName}
              </h1>
              <span className="text-xs text-gray-400 font-medium">
                {handle}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-800 capitalize">
                {profile?.niche ? profile.niche.replace(/_/g, " ") : "Creator Economy"}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-700 capitalize">
                {profile?.follower_band ? profile.follower_band.replace(/_/g, " ") : "Verified Creator"}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {profile?.state || "India"}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-gray-400" />
                UPI: {profile?.upi_vpa || "creator@upi"}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Link
            href="/settings"
            className="w-8 h-8 rounded-full bg-[#F5F9FA] hover:bg-gray-100 border border-[#EAF2F4] flex items-center justify-center text-gray-600 transition-colors"
            title="Edit Profile & Settings"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Row with colored underline indicators */}
      <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400">
            Total Deal Value
          </p>
          <p className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-1">
            {formattedIncome}
          </p>
          <div className="w-full h-1 bg-[#F1B4B9] rounded-full mt-2" />
        </div>

        <div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400">
            Active Deals
          </p>
          <p className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-1">
            {dealStats.count}
          </p>
          <div className="w-full h-1 bg-[#96D7CF] rounded-full mt-2" />
        </div>

        <div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400">
            Standard Terms
          </p>
          <p className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-1">
            Net-15 Days
          </p>
          <div className="w-full h-1 bg-[#DAF4AA] rounded-full mt-2" />
        </div>
      </div>
    </div>
  );
};
