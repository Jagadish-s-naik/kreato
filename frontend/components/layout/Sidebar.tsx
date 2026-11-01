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
  Bell,
  Settings,
  Sparkles,
  X,
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

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
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
      badge: "Risk",
      badgeColor: "bg-pastel-coral text-red-900",
    },
  ];

  const financialNav: NavItem[] = [
    { id: "contracts", label: "Deal Memos", href: "/contracts", icon: FileCheck },
    { id: "invoices", label: "Invoices & Payments", href: "/invoices", icon: Receipt },
    { id: "brand-ledger", label: "Brand Ledger", href: "/ledger", icon: BookOpen },
    { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-60 flex flex-col justify-between h-full py-5 px-3 bg-transparent select-none shrink-0">
      {/* Brand Header & Mobile Close */}
      <div className="flex items-center justify-between px-2 mb-6">
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center bg-transparent transition-transform group-hover:scale-105">
            <img
              src="/kreato-logo.png"
              alt="Kreato K symbol"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-base text-gray-900 tracking-tight block leading-tight">
              Kreato
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide">
              Income Defense
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-full hover:bg-gray-200/60 text-gray-500 transition-colors"
            title="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav Lists */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-0.5">
        {/* Core Menu */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-1.5 block">
            Core Workflow
          </span>
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
                  onClick={onCloseMobile}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#000305] text-white shadow-soft"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-pastel-lime" : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
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

        {/* Income Defense */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-1.5 block">
            Income Defense
          </span>
          <nav className="space-y-1">
            {financialNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#000305] text-white shadow-soft"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-pastel-lime" : "text-gray-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Copilot Mini Banner */}
        <div className="p-3 rounded-2xl bg-white/90 border border-white/80 shadow-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold text-gray-900">
              Copilot Active
            </span>
          </div>
          <p className="text-[10px] text-gray-500 leading-snug">
            Deterministic formulas guarding against perpetual rights & delay traps.
          </p>
        </div>
      </div>

      {/* Profile Mini Card at Bottom */}
      <div className="mt-3 pt-2">
        <div className="bg-white/95 rounded-2xl p-2.5 shadow-soft border border-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={mockCreatorProfile.avatarUrl}
              alt={mockCreatorProfile.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-100"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">
                {mockCreatorProfile.name}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {mockCreatorProfile.handle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Link
              href="/settings"
              className="p-1 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
