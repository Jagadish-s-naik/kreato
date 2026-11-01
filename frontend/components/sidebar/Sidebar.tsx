"use client";

import React, { useState } from "react";
import {
  Compass,
  BarChart2,
  LayoutGrid,
  Users,
  UserCheck,
  Upload,
  Mail,
  MessageSquare,
  Radio,
  Send,
  FileText,
  ChevronDown,
  Headphones,
  Mic,
  Bell,
  Settings,
  MoreVertical,
  Building2,
} from "lucide-react";
import { mockAgentProfile } from "@/frontend/data/mockDashboardData";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState("my-activity");

  const menuItems: NavItem[] = [
    { id: "my-activity", label: "My Activity", icon: Compass },
    { id: "my-stats", label: "My Stats", icon: BarChart2 },
    { id: "overview", label: "Overview", icon: LayoutGrid },
  ];

  const leadItems: NavItem[] = [
    { id: "leads-list", label: "Leads List", icon: Users },
    { id: "buyers-list", label: "Buyers List", icon: UserCheck },
    { id: "import", label: "Import", icon: Upload },
  ];

  const commsItems: NavItem[] = [
    { id: "emails", label: "Emails", icon: Mail },
    { id: "texts", label: "Texts", icon: MessageSquare },
    { id: "live-chat", label: "Live Chat", icon: Radio },
    { id: "postcards", label: "Postcards", icon: Send },
    { id: "templates", label: "Templates", icon: FileText },
  ];

  return (
    <aside className="w-64 flex flex-col justify-between h-full py-6 px-4 bg-transparent select-none">
      {/* Top Brand Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white shadow-sm">
          <Building2 className="w-4 h-4" />
        </div>
        <span className="font-bold text-lg text-gray-900 tracking-tight">Realty Hub</span>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* Menu Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Menu
            </span>
            <div className="w-4 h-3.5 border border-gray-300 rounded-sm" />
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-darkpill text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Leads Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Leads
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
          </div>
          <nav className="space-y-1">
            {leadItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-darkpill text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Comms Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Comms
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
          </div>
          <nav className="space-y-1">
            {commsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-darkpill text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Floating Bottom Agent Dock */}
      <div className="mt-4 pt-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-3 shadow-soft border border-white/60">
          {/* Quick Action Icons Bar */}
          <div className="flex items-center justify-between px-2 pb-2.5 mb-2.5 border-b border-gray-100 text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Audio">
              <Headphones className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Mic">
              <Mic className="w-4 h-4" />
            </button>
            <div className="relative">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Messages">
                <MessageSquare className="w-4 h-4" />
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Notifications">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mini Agent Info */}
          <div className="flex items-center gap-2.5 px-1">
            <img
              src={mockAgentProfile.avatarUrl}
              alt={mockAgentProfile.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {mockAgentProfile.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {mockAgentProfile.email}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-700 p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

