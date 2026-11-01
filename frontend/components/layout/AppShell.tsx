"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ActivityFeed } from "./ActivityFeed";

interface AppShellProps {
  children: React.ReactNode;
  showFeed?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  showFeed = true,
}) => {
  return (
    <div className="min-h-screen bg-canvas flex justify-center text-gray-900 font-sans antialiased p-3 sm:p-5">
      <div className="w-full max-w-[1440px] flex flex-col md:flex-row gap-6">
        {/* Left Column: Navigation Sidebar */}
        <Sidebar />

        {/* Center Main Workspace */}
        <main className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <div className="flex-1 mt-2">{children}</div>
        </main>

        {/* Right Column: Live Feed */}
        {showFeed && (
          <div className="hidden xl:block">
            <ActivityFeed />
          </div>
        )}
      </div>
    </div>
  );
};

