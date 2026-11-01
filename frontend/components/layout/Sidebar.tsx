"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Inbox,
  Kanban,
  Radar,
  FileCheck,
  Receipt,
  BookOpen,
  Headphones,
  Mic,
  Bell,
  Settings,
  MoreVertical,
  Shield,
  Sparkles,
} from "lucide-react";
import { mockCreatorProfile } from "@/frontend/data/mockKreatoData";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const coreNav: NavItem[] = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Compass },
    {
      id: "inbox",
      label: "Deal Inbox",
      href: "/inbox",
      icon: Inbox,
      badge: "New",
      badgeColor: "bg-pastel-lime text-emerald-900",
    },
    { id: "pipeline", label: "Deal Pipeline", href: "/deals", icon: Kanban },
    {
      id: "radar",
      label: "Money Leak Radar",
      href: "/radar",
      icon: Radar,
      badge: "₹ Risk",
      badgeColor: "bg-pastel-coral text-red-900",
    },
  ];

  const financialNav: NavItem[] = [
    { id: "contracts", label: "Deal Memos", href: "/contracts", icon: FileCheck },
    { id: "invoices", label: "Invoices & Payments", href: "/invoices", icon: Receipt },
    { id: "brand-ledger", label: "Brand Ledger", href: "/ledger", icon: BookOpen },
  ];

  return (
    <aside className="w-64 flex flex-col justify-between h-full py-6 px-4 bg-transparent select-none shrink-0">
      {/* Top Kreato Brand Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-9 h-9 rounded-2xl bg-[#000305] flex items-center justify-center text-white shadow-card">
          <Shield className="w-5 h-5 text-pastel-lime" />
        </div>
        <div>
          <span className="font-extrabold text-xl text-gray-900 tracking-tight block leading-none">
            Kreato
          </span>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">
            Creator Income Shield
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* Core Menu */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Core Workflow
            </span>
          </div>
          <nav className="space-y-1">
            {coreNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#000305] text-white shadow-soft"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-pastel-lime" : "text-gray-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Financial & Legal Protection */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Income Defense
            </span>
          </div>
          <nav className="space-y-1">
            {financialNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#000305] text-white shadow-soft"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-pastel-lime" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* AI Copilot Badge Card */}
        <div className="mx-1 p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#F5F9FA] border border-white/80 shadow-card">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-gray-900">Kreato Copilot</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-snug">
            Deterministic benchmark defense & client PII masked negotiation drafter.
          </p>
        </div>
      </div>

      {/* Floating Bottom Creator Dock */}
      <div className="mt-4 pt-3">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-soft border border-white/80">
          {/* Quick Action Icons Bar */}
          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-gray-100 text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Support">
              <Headphones className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Voice Notes">
              <Mic className="w-3.5 h-3.5" />
            </button>
            <div className="relative">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Alerts">
                <Bell className="w-3.5 h-3.5" />
              </button>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                1
              </span>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Settings">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini Profile */}
          <div className="flex items-center gap-2.5 px-1">
            <img
              src={mockCreatorProfile.avatarUrl}
              alt={mockCreatorProfile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">
                {mockCreatorProfile.name}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {mockCreatorProfile.handle}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-700 p-1">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

