import { MarketingNav } from "@/frontend/components/marketing/MarketingNav";
import { HeroSection } from "@/frontend/components/marketing/HeroSection";
import { ValueStrip } from "@/frontend/components/marketing/ValueStrip";
import { FeatureSectionsGroup } from "@/frontend/components/marketing/FeatureSectionsGroup";
import { TestimonialsCarousel } from "@/frontend/components/marketing/TestimonialsCarousel";
import { CopilotDarkSection } from "@/frontend/components/marketing/CopilotDarkSection";
import { PricingSection } from "@/frontend/components/marketing/PricingSection";
import { TrustAndFaqSection } from "@/frontend/components/marketing/TrustAndFaqSection";
import { StickyBottomCta } from "@/frontend/components/marketing/StickyBottomCta";
import { MarketingFooter } from "@/frontend/components/marketing/MarketingFooter";

export default function PublicLandingPage() {
  return (
    <>
      {/* Sticky floating pill nav */}
      <MarketingNav />

      {/* Main page flow */}
      <main>
        <HeroSection />
        <ValueStrip />
        <FeatureSectionsGroup />
        <TestimonialsCarousel />
        <CopilotDarkSection />
        <PricingSection />
        <TrustAndFaqSection />
      </main>

      {/* Persistent bottom CTA */}
      <StickyBottomCta />

      {/* Dark footer */}
      <MarketingFooter />
    </>
  );
}

