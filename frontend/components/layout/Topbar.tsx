"use client";

import React, { useState } from "react";
import {
  Search,
  Command,
  Clock,
  FastForward,
  RotateCcw,
  Menu,
  Bell,
} from "lucide-react";
import { mockCreatorProfile } from "@/frontend/data/mockKreatoData";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const [simOffset, setSimOffset] = useState(mockCreatorProfile.simDaysOffset);

  const handleAdvance30Days = () => {
    setSimOffset((prev) => prev + 30);
  };

  const handleResetClock = () => {
    setSimOffset(0);
  };

  return (
    <header className="flex items-center justify-between gap-3 py-2 px-1">
      {/* Mobile Hamburger & Search Input */}
      <div className="flex items-center gap-2.5 flex-1 max-w-md">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 bg-white rounded-full shadow-card border border-gray-100 text-gray-700 hover:text-black transition-colors shrink-0"
            title="Open navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1 relative">
          <div className="flex items-center bg-white rounded-full px-3.5 py-2 shadow-soft border border-gray-100/80">
            <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search deals, brands, invoices..."
              className="w-full text-xs bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            <div className="hidden sm:flex items-center gap-1 ml-2 text-gray-400">
              <span className="text-[9px] font-bold bg-gray-50 border border-gray-200/80 rounded px-1.5 py-0.5">
                ⌘K
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Time-Travel Simulator Clock & Notifications */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Time-Travel Clock Demo Controller */}
        <div className="flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1.5 shadow-soft border border-gray-100">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 pr-1.5 border-r border-gray-100">
            <Clock className="w-3 h-3 text-indigo-600" />
            <span className="hidden sm:inline">
              {simOffset === 0 ? "Today" : `+${simOffset}d`}
            </span>
          </div>
          <button
            onClick={handleAdvance30Days}
            className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-0.5 transition-colors"
            title="Advance 30 days"
          >
            <FastForward className="w-2.5 h-2.5" /> +30d
          </button>
          {simOffset > 0 && (
            <button
              onClick={handleResetClock}
              className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
              title="Reset clock"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button className="relative w-8 h-8 rounded-full bg-white shadow-soft border border-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>
      </div>
    </header>
  );
};
