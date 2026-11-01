"use client";

import React, { useState } from "react";
import { ChevronDown, RotateCw, Maximize2 } from "lucide-react";
import { mockNewObjects } from "@/frontend/data/mockDashboardData";

export const NewObjectsSection: React.FC = () => {
  const [timeframe, setTimeframe] = useState("This Month");

  return (
    <div className="bg-white rounded-4xl p-6 shadow-soft border border-white/60">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            New Objects
          </h2>
          <span className="text-xs font-semibold text-gray-400">(3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-700 cursor-pointer transition-colors border border-gray-100">
            <span>{timeframe}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <button
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
            title="Refresh Objects"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Property Objects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockNewObjects.map((property) => (
          <div
            key={property.id}
            className="relative h-44 rounded-3xl overflow-hidden group shadow-card border border-gray-100/50"
          >
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Tag Badge */}
            <span
              className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-semibold shadow-sm backdrop-blur-xs ${
                property.type === "Rental"
                  ? "bg-pastel-mint text-emerald-800"
                  : "bg-pastel-coral text-red-900"
              }`}
            >
              {property.type}
            </span>

            {/* Inspect / Fullscreen Button */}
            <button
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-gray-700 transition-all shadow-sm"
              title="Expand Property"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

