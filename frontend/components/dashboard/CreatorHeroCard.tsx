"use client";

import React from "react";
import { Share2, Edit2, ShieldCheck, MapPin, Building2 } from "lucide-react";
import { mockCreatorProfile } from "@/frontend/data/mockKreatoData";

export const CreatorHeroCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-[#EAF2F4]">
      {/* Top Row: Avatar, Identity & Quick Action Icons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#EAF2F4]">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={mockCreatorProfile.avatarUrl}
              alt={mockCreatorProfile.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-gray-100"
            />
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
                {mockCreatorProfile.name}
              </h1>
              <span className="text-xs text-gray-400 font-medium">
                {mockCreatorProfile.handle}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-800">
                {mockCreatorProfile.niche}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-700">
                {mockCreatorProfile.followerBand} ({(mockCreatorProfile.totalFollowers / 1000).toFixed(1)}k followers)
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {mockCreatorProfile.location}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-gray-400" />
                GST: {mockCreatorProfile.gstin}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            className="w-8 h-8 rounded-full bg-[#F5F9FA] hover:bg-gray-100 border border-[#EAF2F4] flex items-center justify-center text-gray-600 transition-colors"
            title="Share Rate Card"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-[#F5F9FA] hover:bg-gray-100 border border-[#EAF2F4] flex items-center justify-center text-gray-600 transition-colors"
            title="Edit Profile"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Row with colored underline indicators (Exactly Matching Image 2) */}
      <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400">
            Total Income Protected
          </p>
          <p className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-1">
            ₹3,45,000
          </p>
          <div className="w-full h-1 bg-[#F1B4B9] rounded-full mt-2" />
        </div>

        <div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400">
            Deals Closed
          </p>
          <p className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-1">
            12
          </p>
          <div className="w-full h-1 bg-[#96D7CF] rounded-full mt-2" />
        </div>

        <div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400">
            Average Paid Terms
          </p>
          <p className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-1">
            14 Days
          </p>
          <div className="w-full h-1 bg-[#DAF4AA] rounded-full mt-2" />
        </div>
      </div>
    </div>
  );
};
