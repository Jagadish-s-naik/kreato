import type { Metadata } from "next";
import { MarketingNav } from "@/frontend/components/marketing/MarketingNav";
import { HeroSection } from "@/frontend/components/marketing/HeroSection";
import { ValueStrip } from "@/frontend/components/marketing/ValueStrip";
import { FeatureSectionsGroup } from "@/frontend/components/marketing/FeatureSectionsGroup";
import { CopilotDarkSection } from "@/frontend/components/marketing/CopilotDarkSection";
import { PricingSection } from "@/frontend/components/marketing/PricingSection";
import { TrustAndFaqSection } from "@/frontend/components/marketing/TrustAndFaqSection";
import { MarketingFooter } from "@/frontend/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Kreato | The Creator Business Platform",
  description:
    "Manage brand deals, protect creator income with the Money Leak Radar, simplify contracts, and track every payment in one intelligent workspace.",
};

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#3C55F5]/10 selection:text-[#3C55F5]">
      {/* Floating Pill Navigation */}
      <MarketingNav />

      {/* Main Page Flow */}
      <main>
        <HeroSection />
        <ValueStrip />
        <FeatureSectionsGroup />
        <CopilotDarkSection />
        <PricingSection />
        <TrustAndFaqSection />
      </main>

      {/* High-Contrast Multi-Column Footer */}
      <MarketingFooter />
    </div>
  );
}
