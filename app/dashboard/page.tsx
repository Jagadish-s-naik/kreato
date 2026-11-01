"use client";

import React from "react";
import { AppShell } from "@/frontend/components/layout/AppShell";
import { CreatorHeroCard } from "@/frontend/components/dashboard/CreatorHeroCard";
import { PastelSummaryCards } from "@/frontend/components/dashboard/PastelSummaryCards";
import { DealPipelinePreview } from "@/frontend/components/dashboard/DealPipelinePreview";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Creator Identity & KPI Stats */}
        <CreatorHeroCard />

        {/* 3 Pastel Summary Cards: Money at Risk, Pipeline, Recovered */}
        <PastelSummaryCards />

        {/* Deal Pipeline Preview */}
        <DealPipelinePreview />
      </div>
    </AppShell>
  );
}
