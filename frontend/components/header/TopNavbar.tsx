"use client";

import React from "react";
import { Search, Mic, Command } from "lucide-react";
import { mockOnlineUsers } from "@/frontend/data/mockDashboardData";

export const TopNavbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between gap-4 py-4 px-2">
      {/* Search Input Floating Pill */}
      <div className="relative w-72 md:w-96">
        <div className="flex items-center bg-white rounded-full px-4 py-2.5 shadow-soft border border-gray-100/80">
          <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="w-full text-xs md:text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />
          <div className="flex items-center gap-1.5 ml-2 text-gray-400">
            <span className="text-[11px] font-medium bg-gray-50 border border-gray-200/60 rounded px-1.5 py-0.5 flex items-center gap-0.5">
              <Command className="w-3 h-3" />
            </span>
            <button className="hover:text-gray-600 transition-colors">
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-4">
        {/* Integrations Pill Button */}
        <div className="hidden sm:flex items-center gap-2 bg-white rounded-full px-3.5 py-2 shadow-soft border border-gray-100/80 cursor-pointer hover:bg-gray-50/80 transition-all">
          <span className="text-xs font-medium text-gray-700">Integration</span>
          <div className="flex items-center -space-x-1">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              Z
            </span>
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              S
            </span>
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              M
            </span>
          </div>
        </div>

        {/* Online Users Pill & Stack */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-gray-500 hidden md:inline">
            Now online ({mockOnlineUsers.length})
          </span>
          <div className="flex items-center -space-x-2">
            {mockOnlineUsers.map((user, idx) => (
              <img
                key={user.id}
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
                style={{ zIndex: 10 - idx }}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

