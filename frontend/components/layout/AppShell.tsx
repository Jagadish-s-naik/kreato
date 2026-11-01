"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ActivityFeed } from "./ActivityFeed";

interface AppShellProps {
  children: React.ReactNode;
  showFeed?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  showFeed = false, // Contextual display: default clean on deep workflows, open on dashboard
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex justify-center text-gray-900 font-sans antialiased p-2 sm:p-4 lg:p-5">
      <div className="w-full max-w-[1536px] flex flex-col lg:flex-row gap-5 relative">
        {/* Desktop Sidebar (Fixed 240px) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Touch Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Slide-out Drawer Panel */}
            <div className="relative w-64 max-w-[80vw] bg-canvas h-full shadow-floating p-2 z-10 flex flex-col">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Center Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          <div className="flex-1 mt-2.5 space-y-5">{children}</div>
        </main>

        {/* Right Activity Feed (Shown only on large desktop when enabled) */}
        {showFeed && (
          <div className="hidden 2xl:block">
            <ActivityFeed />
          </div>
        )}
      </div>
    </div>
  );
};
