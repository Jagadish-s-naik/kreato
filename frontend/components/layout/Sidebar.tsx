"use client";

import React, { useState, useEffect } from "react";
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
  Settings,
  Sparkles,
  X,
  LogOut,
} from "lucide-react";
import { createClient } from "@/backend/supabase/client";

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
  const [profile, setProfile] = useState<{
    name: string;
    handle: string;
    initials: string;
  } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const name = json.data.display_name || json.data.email?.split("@")[0] || "Creator";
            const handle = json.data.handle || `@${json.data.email?.split("@")[0] || "creator"}`;
            const initials = name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            setProfile({ name, handle, initials });
          }
        }
      } catch (err) {
        // Fallback
      }
    }
    loadUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (e) {
      window.location.href = "/login";
    }
  };

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

      {/* Main Navigation Stack */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {/* Core Deal Operations */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Operations
          </p>
          <nav className="space-y-1">
            {coreNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-gray-900 shadow-card font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-indigo-600" : "text-gray-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Commercial & Compliance */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Commercial Defense
          </p>
          <nav className="space-y-1">
            {financialNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-gray-900 shadow-card font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-indigo-600" : "text-gray-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
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
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
              {profile?.initials || "CR"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">
                {profile?.name || "Creator Profile"}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {profile?.handle || "@creator"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-gray-400">
            <Link
              href="/settings"
              className="p-1 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
