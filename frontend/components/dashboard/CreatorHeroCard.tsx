"use client";

import React from "react";
import { Share2, Edit2, Phone, Mail, MapPin, Building, ShieldCheck, Instagram, Youtube } from "lucide-react";
import { mockCreatorProfile } from "@/frontend/data/mockKreatoData";

export const CreatorHeroCard: React.FC = () => {
  return (
    <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        {/* Creator Info Avatar + Stats */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={mockCreatorProfile.avatarUrl}
              alt={mockCreatorProfile.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-gray-50 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-[#000305] text-pastel-lime rounded-xl shadow-xs" title="Shield Active">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {mockCreatorProfile.name}
              </h1>
              <span className="text-xs text-gray-400 font-medium">
                {mockCreatorProfile.handle}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              <span className="font-semibold text-gray-800">{mockCreatorProfile.niche}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-700">
                {mockCreatorProfile.followerBand} ({(mockCreatorProfile.totalFollowers / 1000).toFixed(1)}k followers)
              </span>
            </p>

            {/* Direct Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{mockCreatorProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{mockCreatorProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{mockCreatorProfile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>GSTIN: {mockCreatorProfile.gstin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2 self-start">
          <button
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
            title="Share Rate Card"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
            title="Edit Profile & Tax Settings"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Row with colored underline indicators */}
      <div className="grid grid-cols-3 gap-6 pt-5">
        <div>
          <p className="text-xs text-gray-400 font-medium">Total Income Protected</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹3,45,000</p>
          <div className="w-full h-1 bg-pastel-coral rounded-full mt-2.5" />
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Deals Closed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
          <div className="w-full h-1 bg-pastel-teal rounded-full mt-2.5" />
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Average Paid Terms</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">14 Days</p>
          <div className="w-full h-1 bg-pastel-lime rounded-full mt-2.5" />
        </div>
      </div>
    </div>
  );
};

