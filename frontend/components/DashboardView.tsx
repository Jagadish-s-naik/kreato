"use client";

import React from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { TopNavbar } from "./header/TopNavbar";
import { HeroProfileCard } from "./dashboard/HeroProfileCard";
import { SummaryCards } from "./dashboard/SummaryCards";
import { NewObjectsSection } from "./dashboard/NewObjectsSection";
import { LiveFeed } from "./feed/LiveFeed";

export const DashboardView: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas flex justify-center text-gray-900 font-sans antialiased p-3 sm:p-5">
      <div className="w-full max-w-[1440px] flex flex-col md:flex-row gap-6">
        {/* Left Column: Sidebar */}
        <Sidebar />

        {/* Center Main Work Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Search & Actions */}
          <TopNavbar />

          {/* Page Heading */}
          <div className="px-2 pt-2 pb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              My Activity
            </h1>
          </div>

          {/* Center Column Content Cards */}
          <div className="space-y-6 flex-1 pr-0 lg:pr-2">
            <HeroProfileCard />
            <SummaryCards />
            <NewObjectsSection />
          </div>
        </main>

        {/* Right Column: Live Feed */}
        <div className="hidden xl:block">
          <LiveFeed />
        </div>
      </div>
    </div>
  );
};

