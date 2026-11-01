"use client";

import React from "react";
import { Share2, Edit2, Phone, Mail, MapPin, Building } from "lucide-react";
import { mockAgentProfile } from "@/frontend/data/mockDashboardData";

export const HeroProfileCard: React.FC = () => {
  return (
    <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        {/* User Info Avatar + Title */}
        <div className="flex items-center gap-5">
          <img
            src={mockAgentProfile.avatarUrl}
            alt={mockAgentProfile.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-gray-50 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {mockAgentProfile.name}
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {mockAgentProfile.role} {mockAgentProfile.daysActive} days on the platform
            </p>

            {/* Direct Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{mockAgentProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{mockAgentProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{mockAgentProfile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{mockAgentProfile.agency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2 self-start">
          <button
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
            title="Share Profile"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
            title="Edit Profile"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Row with colored underline indicators */}
      <div className="grid grid-cols-3 gap-6 pt-5">
        <div>
          <p className="text-xs text-gray-400 font-medium">Total Listings</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {mockAgentProfile.stats.totalListings}
          </p>
          <div className="w-full h-1 bg-pastel-coral rounded-full mt-2.5" />
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Properties sold</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {mockAgentProfile.stats.propertiesSold}
          </p>
          <div className="w-full h-1 bg-pastel-teal rounded-full mt-2.5" />
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Properties rent</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {mockAgentProfile.stats.propertiesRent}
          </p>
          <div className="w-full h-1 bg-pastel-lime rounded-full mt-2.5" />
        </div>
      </div>
    </div>
  );
};

