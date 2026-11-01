"use client";

import React from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { CreatorHeroCard } from "@/frontend/components/dashboard/CreatorHeroCard";
import { PastelSummaryCards } from "@/frontend/components/dashboard/PastelSummaryCards";
import { DealPipelinePreview } from "@/frontend/components/dashboard/DealPipelinePreview";
import { DashboardLiveFeed } from "@/frontend/components/dashboard/DashboardLiveFeed";

export default function DashboardPage() {
  return (
    <AppShell showFeed={false}>
      {/* 
        Realty Hub Architectural Layout Blueprint:
        [ Central Main Column: minmax(0, 1fr) ]  |  [ Right Live Feed: 310px ]
        On desktop (xl: 1280px+), both columns sit side-by-side as a first-class 2-column grid.
        On smaller viewports, the Live Feed stacks naturally below the central workspace.
      */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_310px] gap-5 items-start">
        {/* AREA B: Central Workspace */}
        <div className="space-y-4 sm:space-y-5 min-w-0">
          {/* Section 1: Creator Profile & Business Overview */}
          <CreatorHeroCard />

          {/* Section 2: Commercial Health Summary (3 Horizontal Pastel Cards) */}
          <PastelSummaryCards />

          {/* Section 3: Recent Deal Pipeline (2 Horizontal Deal Cards) */}
          <DealPipelinePreview />
        </div>

        {/* AREA C: Right-Side Creator Live Feed */}
        <div className="w-full">
          <DashboardLiveFeed />
        </div>
      </div>
    </AppShell>
  );
}
