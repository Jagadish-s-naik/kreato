"use client";

import React from "react";
import {
  RotateCw,
  Phone,
  Mail,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import {
  mockLiveFeedProperty,
  mockLeadActivities,
} from "@/frontend/data/mockDashboardData";

export const LiveFeed: React.FC = () => {
  return (
    <aside className="w-80 flex flex-col gap-5 py-2 pl-2 pr-1 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          Live Feed
        </h2>
        <button
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-all"
          title="Refresh Feed"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto pr-1">
        {/* Timeline Property Card */}
        <div className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200">
          <div className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center">
            <Bookmark className="w-2 h-2 text-gray-500" />
          </div>
          <div className="text-[11px] text-gray-400 mb-2">
            Tu, 25.03 <br /> 1:23 pm
          </div>

          {/* Property Card */}
          <div className="bg-white rounded-3xl p-3 shadow-card border border-gray-100/60">
            <div className="relative h-28 rounded-2xl overflow-hidden mb-3">
              <img
                src={mockLiveFeedProperty.imageUrl}
                alt={mockLiveFeedProperty.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-semibold bg-pastel-coral text-pastel-coral-text rounded-full shadow-sm">
                Sale
              </span>
            </div>

            <h3 className="text-xs font-bold text-gray-900 leading-tight">
              {mockLiveFeedProperty.title}
            </h3>
            <p className="text-[11px] text-gray-400 truncate mt-0.5 mb-2.5">
              {mockLiveFeedProperty.address}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
              <span className="text-gray-500 font-medium">Property Viewed</span>
              <div className="flex items-center gap-1">
                <span className="w-6 h-6 rounded-full bg-darkpill text-white text-[10px] font-semibold flex items-center justify-center">
                  +{mockLiveFeedProperty.viewersCount}
                </span>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                  alt="Viewer"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Activity Items */}
        {mockLeadActivities.map((lead) => (
          <div
            key={lead.id}
            className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200"
          >
            <div className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            </div>
            <div className="text-[11px] text-gray-400 mb-2">{lead.time}</div>

            <div className="bg-white rounded-3xl p-3.5 shadow-card border border-gray-100/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={lead.userAvatar}
                    alt={lead.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      {lead.userName}
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      {lead.activityTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-400">
                  {lead.actionType === "mail" && (
                    <button className="p-1 hover:text-gray-700 rounded-full hover:bg-gray-50">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {lead.actionType === "call" && (
                    <button className="p-1 hover:text-gray-700 rounded-full hover:bg-gray-50">
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button className="p-1 hover:text-gray-700 rounded-full hover:bg-gray-50">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {lead.searchQuery && (
                <div className="mt-2.5 px-2.5 py-1.5 bg-gray-50 rounded-xl text-[11px] text-gray-600 flex items-center gap-1.5">
                  <span className="text-gray-400 font-semibold">Q</span>
                  <span className="truncate">{lead.searchQuery}</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px]">
                <span className="text-gray-400 font-medium">
                  {lead.badgeRole || "Lead"}
                </span>
                <span className="text-gray-500 font-semibold">
                  {lead.statusLabel || "Updated"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

