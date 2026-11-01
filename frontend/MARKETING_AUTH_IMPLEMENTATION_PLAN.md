# IMPLEMENTATION PLAN: KREATO MARKETING & AUTHENTICATION EXPERIENCE

> **Reference Target:** Beacons.ai (Visual architecture, typography rhythm, floating product mockup compositions, split-screen auth)  
> **Destination Codebase:** Next.js App Router (`z:\kreato-1\app`, `z:\kreato-1\frontend`)  
> **Status:** Ready for Execution upon Approval  

---

## 1. Plan Overview & Execution Roadmap

The implementation translates Beacons' visual excellence into Kreato's creator business platform across 8 focused phases without disrupting existing dashboard workflows:

```
[Phase 1: Foundation & Shared Marketing Tokens]
  ├── Marketing color tokens, typography scales, glassmorphic styles
  └── Verification of assets (kreato-logo.png, icons)

[Phase 2: Floating Navigation Bar]
  ├── Capsule floating nav (Logo + Anchor links + Sign In + Start for free CTA)
  └── Mobile slide-out drawer

[Phase 3: Hero Section & Floating Showcase Composition]
  ├── Gradient aura canvas (soft cyan, lavender, rose)
  ├── Geometric hero headline & dual CTA buttons
  └── Floating showcase: Dashboard preview + 4 interactive floating deal/risk cards

[Phase 4: Value Pillars & Alternating Feature Sections]
  ├── Value strip: Ingest → Analyze → Settle
  ├── Feature 1: Deal Ingestion & Organization (Mockup: Deal Inbox card)
  ├── Feature 2: Money Leak Radar (Mockup: 5-part leakage math breakdown)
  ├── Feature 3: Deal Copilot & Contract Shield (Mockup: Counter-offer ladder)
  └── Feature 4: Connected Records & Invoicing (Mockup: GST invoice + Ledger)

[Phase 5: Obsidian Dark AI Showcase (Kreato Copilot)]
  ├── High-contrast dark section with subtle glowing teal/violet borders
  ├── Floating capability chips (Deal Intelligence, Contract Auditing, etc.)
  └── Real-time interactive counter-offer demo widget

[Phase 6: Pricing, Trust & FAQ Sections]
  ├── 3-tier creator pricing table (Monthly / Annual toggle)
  ├── Trust & value transparency section (no fabricated statistics)
  ├── Interactive FAQ accordion
  └── Pre-footer CTA banner + Multi-column dark footer

[Phase 7: Sign-Up & Sign-In Experience]
  ├── /signup: Two-column layout (Form Left, Floating Mockup Right)
  ├── /login: Minimal, distraction-free centered card with demo quick-fill
  └── /forgot-password: Password reset request view

[Phase 8: Routing, Quality Assurance & Visual Verification]
  ├── Connect public page at app/page.tsx
  ├── Ensure /dashboard and all existing routes remain untouched & functional
  └── Cross-breakpoint verification (Desktop, Tablet, Mobile)
```

---

## 2. Component Inventory

| Component | Path | Description |
|---|---|---|
| `MarketingNav` | `frontend/components/marketing/MarketingNav.tsx` | Sticky floating pill navbar with mobile drawer |
| `HeroSection` | `frontend/components/marketing/HeroSection.tsx` | Hero typography, dual CTAs, gradient aura |
| `FloatingShowcase` | `frontend/components/marketing/FloatingShowcase.tsx` | Dashboard preview framed by floating deal & leak cards |
| `ValueStrip` | `frontend/components/marketing/ValueStrip.tsx` | 3-step connected workflow cards |
| `FeatureRow` | `frontend/components/marketing/FeatureRow.tsx` | Alternating asymmetric feature showcase |
| `CopilotDarkSection` | `frontend/components/marketing/CopilotDarkSection.tsx` | Dark obsidian section with interactive capability chips |
| `PricingSection` | `frontend/components/marketing/PricingSection.tsx` | 3 plans (Starter, Pro Defense, Studio) with billing toggle |
| `TrustSection` | `frontend/components/marketing/TrustSection.tsx` | Transparent value propositions & impact metrics |
| `FaqSection` | `frontend/components/marketing/FaqSection.tsx` | Accordion addressing data privacy, GST, and copilot |
| `FinalCtaBanner` | `frontend/components/marketing/FinalCtaBanner.tsx` | Bold conversion banner before footer |
| `MarketingFooter` | `frontend/components/marketing/MarketingFooter.tsx` | Multi-column dark footer with real links & copyright |
| `SignUpForm` | `frontend/components/auth/SignUpForm.tsx` | Split 2-column registration interface |
| `SignInForm` | `frontend/components/auth/SignInForm.tsx` | Centered modern login card with demo quick-fill |

---

## 3. Strict Boundary Guarantees
- **No changes to existing dashboard routes**: `/dashboard`, `/inbox`, `/deals`, `/radar`, `/contracts`, `/invoices`, `/ledger` are preserved.
- **No backend or schema modifications**: Existing Supabase config and database tables are left as read-only.
- **Zero new dependencies**: Reuses existing `lucide-react`, `tailwind`, and `framer-motion` already installed.

