"use client";

import React, { useState } from "react";
import { Search, Mic, Command, Clock, FastForward, RotateCcw } from "lucide-react";
import { mockCreatorProfile } from "@/frontend/data/mockKreatoData";

export const Topbar: React.FC = () => {
  const [simOffset, setSimOffset] = useState(mockCreatorProfile.simDaysOffset);

  const handleAdvance30Days = () => {
    setSimOffset((prev) => prev + 30);
  };

  const handleResetClock = () => {
    setSimOffset(0);
  };

  return (
    <header className="flex items-center justify-between gap-4 py-3 px-2">
      {/* Search Bar Floating Pill */}
      <div className="relative w-72 md:w-96">
        <div className="flex items-center bg-white rounded-full px-4 py-2.5 shadow-soft border border-gray-100">
          <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search deals, brands, invoices..."
            className="w-full text-xs md:text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />
          <div className="flex items-center gap-1.5 ml-2 text-gray-400">
            <span className="text-[10px] font-medium bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 flex items-center gap-0.5">
              <Command className="w-3 h-3" /> K
            </span>
            <button className="hover:text-gray-600 transition-colors">
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Controls: Time-Travel Clock Simulator & Status */}
      <div className="flex items-center gap-3">
        {/* Time-Travel Demo Control */}
        <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-soft border border-gray-100">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 pr-1.5 border-r border-gray-200">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {simOffset === 0 ? "Live Clock (IST)" : `Sim +${simOffset}d`}
            </span>
          </div>
          <button
            onClick={handleAdvance30Days}
            className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1 transition-colors"
            title="Simulate 30 days passing"
          >
            <FastForward className="w-3 h-3" /> +30d
          </button>
          {simOffset > 0 && (
            <button
              onClick={handleResetClock}
              className="p-1 hover:bg-gray-100 text-gray-500 rounded-full transition-colors"
              title="Reset to today"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Channel Indicators */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-soft border border-gray-100">
          <span className="text-[11px] font-medium text-gray-500">Channels:</span>
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center" title="WhatsApp Connected">
            WA
          </span>
          <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center" title="Instagram DMs Connected">
            IG
          </span>
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center" title="Gmail Connected">
            GM
          </span>
        </div>
      </div>
    </header>
  );
};

