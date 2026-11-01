# DESIGN SYSTEM & ARCHITECTURE SPECIFICATION: KREATO MARKETING & AUTHENTICATION EXPERIENCE

> **Project:** Kreato — The Creator Business Platform  
> **Target Experiences:** Public Landing Page (`/`), Sign-Up Experience (`/signup`), Sign-In Experience (`/login`, `/forgot-password`)  
> **Design Inspiration:** Beacons.ai (Visual architecture, typography hierarchy, floating product showcase, asymmetric feature narratives, dual-column auth)  
> **Status:** Pending User Approval  

---

## 1. Executive Summary & Design Translation

We are translating the visual rhythm, modern spaciousness, and high-impact storytelling of **Beacons.ai** into **Kreato's Creator Business Platform**. While Beacons focuses on link-in-bio, storefronts, and creator monetization, Kreato is the financial defense, deal intelligence, and workflow management engine for independent creators.

### Beacons Design DNA Translated to Kreato:
1. **Floating Pill Navigation**: Glassmorphic / rounded white capsule (`rounded-full`, soft drop shadow, border-neutral-100) anchored at the top with clear brand typography, product anchor links, and a signature CTA button (`Start for free`).
2. **Hero Typography & Asymmetric Aura Gradients**: Ultra-bold geometric title (`Your creator business. Under control.`), soft atmospheric multi-tint gradient blur fields (pale cyan `#E0F7F6`, lavender `#ECE9FE`, and soft rose `#FDECEF`) fading into pure white.
3. **Floating Interactive Showcase**: Central product frame (creator dashboard preview) flanked by realistic, high-impact floating interaction cards:
   - *Brand Offer Ingestion*: GlowSkin India (₹25,000 offer vs ₹75,000 fair benchmark).
   - *Money Leak Radar Alert*: ⚠️ Perpetual usage rights detected (+₹50,000 leak exposure).
   - *Invoice & Cashflow*: Invoice KR-011 paid (+₹35,400 via UPI).
   - *Copilot Counter-Offer*: "Counter at ₹85,000 with 60-day digital exclusivity."
4. **Asymmetric Feature Blocks (Alternating Left/Right)**:
   - **Feature 1: Deal Ingestion & Organization**: Clean capture of chaotic brand DMs/emails into structured deliverables.
   - **Feature 2: Money Leak Radar**: 5-part mathematical risk engine exposing underpricing, payment delay financing, and exclusivity traps.
   - **Feature 3: Deal Copilot & Contract Shield**: Clear distinction between AI recommendations and executed commercial agreements.
   - **Feature 4: Deal Memo to Cashflow**: Connected timeline from contract signature to GST-compliant invoicing and payment settlement.
5. **Contrasting Dark AI Showcase (Meet Kreato Copilot)**: A rich obsidian/slate section (`#0A0D14` to `#111622`) with glowing teal/mint accents (`#45CDB5`), showcasing deal risk scanning, real-time contract auditing, and proactive cashflow defense.
6. **Transparent Creator-First Pricing**: Multi-tier transparent plan cards (Free / Pro Defense / Studio) with month/annual toggle.
7. **Two-Column Split Sign-Up**: Form on the left, high-fidelity creator showcase on the right with floating deal cards and visual testimonials of value.
8. **Minimal Centered Sign-In**: Distraction-free, centered authentication card with password visibility toggle, demo quick-fill, and password recovery states.

---

## 2. Visual Identity & Design Tokens

### A. Color Palette (Scoped specifically to Marketing & Auth)
```css
/* Surfaces */
--mkt-bg-canvas: #FFFFFF;
--mkt-bg-subtle: #F9FAFC;
--mkt-bg-muted: #F3F6FA;
--mkt-border: #E5E9F0;
--mkt-border-subtle: #F0F3F7;

/* Text */
--mkt-text-heading: #0F172A; /* Slate-900 */
--mkt-text-body: #475569;    /* Slate-600 */
--mkt-text-muted: #94A3B8;   /* Slate-400 */

/* Primary Brand & Accents */
--mkt-brand-blue: #3C55F5;   /* Beacons-style high-intent CTA */
--mkt-brand-blue-hover: #2D44E0;
--mkt-brand-teal: #45CDB5;   /* Kreato signature mint/teal */
--mkt-brand-violet: #8C7CF1; /* Kreato gradient accent */
--mkt-brand-dark: #000305;   /* Kreato signature dark slate */

/* Status / Alert Chips */
--mkt-chip-leak: #FEE2E2;    /* Soft red for leaks */
--mkt-chip-leak-text: #991B1B;
--mkt-chip-safe: #DCFCE7;    /* Soft green for cleared deals */
--mkt-chip-safe-text: #166534;
```

### B. Typography Hierarchy
- **Hero Title**: `text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]`
- **Section Heading**: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900`
- **Subheadings**: `text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl`
- **Card Titles**: `text-base sm:text-lg font-bold text-slate-900`
- **Body / Metadata**: `text-sm text-slate-500`

---

## 3. Landing Page Structure (`/`)

```
┌────────────────────────────────────────────────────────────────┐
│ Floating Navigation Bar (Logo, Links, Sign In, Start Free CTA) │
├────────────────────────────────────────────────────────────────┤
│ HERO SECTION:                                                  │
│   • Multi-tint gradient aura (Cyan + Lavender + Rose)          │
│   • "Your creator business. Under control."                    │
│   • Subtitle + Dual CTAs + Micro Social Proof                  │
│   • Interactive Floating Product Showcase (Dashboard Mockup    │
│     surrounded by floating Deal, Radar, and Payment Cards)     │
├────────────────────────────────────────────────────────────────┤
│ VALUE PILLARS STRIP:                                           │
│   "From first brand DM to final bank settlement"               │
│   3-step connected pipeline (Ingest → Analyze → Settle)        │
├────────────────────────────────────────────────────────────────┤
│ FEATURE 1 (Alternating: Text Left, Mockup Right):              │
│   "Every brand opportunity, organized."                        │
│   [Deal Inbox & Automatic Extraction Preview]                  │
├────────────────────────────────────────────────────────────────┤
│ FEATURE 2 (Alternating: Mockup Left, Text Right):              │
│   "Know what every deal is really worth."                      │
│   [Money Leak Radar 5-part Math Breakdown Preview]             │
├────────────────────────────────────────────────────────────────┤
│ FEATURE 3 (Alternating: Text Left, Mockup Right):              │
│   "Better terms start with better insights."                   │
│   [Deal Copilot Walk-Away Ladder & Contract Term Analysis]     │
├────────────────────────────────────────────────────────────────┤
│ FEATURE 4 (Alternating: Mockup Left, Text Right):              │
│   "Every agreement. Every invoice. Every payment. Connected."  │
│   [Personal Brand Ledger & GST Tax Invoice Preview]            │
├────────────────────────────────────────────────────────────────┤
│ AI COPILOT SHOWCASE (High-Contrast Obsidian/Dark Section):     │
│   "Meet your creator-business copilot."                        │
│   • Glow effects + Interactive capability chips                │
│   • Live counter-offer simulator preview                       │
├────────────────────────────────────────────────────────────────┤
│ TRANSPARENT PRICING SECTION:                                   │
│   Monthly/Annual Switcher • 3 Clear Cards (Starter, Pro, Team) │
├────────────────────────────────────────────────────────────────┤
│ TESTIMONIALS & TRUST SECTION:                                  │
│   "Built for the business behind every collaboration"          │
│   3 Verified Creator Impact Metrics & Authentic Case Studies   │
├────────────────────────────────────────────────────────────────┤
│ FAQ SECTION:                                                   │
│   Interactive Accordion (Data security, GST, Pricing, Copilot) │
├────────────────────────────────────────────────────────────────┤
│ FINAL CALL-TO-ACTION (CTA) BANNER:                             │
│   "Spend more time creating. Stay in control of your business."│
├────────────────────────────────────────────────────────────────┤
│ MULTI-COLUMN DARK FOOTER:                                      │
│   Branding, Product Links, Legal, System Status, Copyright     │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Authentication Architecture

### A. Sign-Up Experience (`/signup`)
- **Left Column (45%)**:
  - Official Kreato K Logo + Brand Wordmark.
  - Heading: *"Create your Kreato account"*
  - Subhead: *"Protect your income and manage your deals with confidence."*
  - Form Fields:
    - Full Name
    - Creator Handle / Social Channel (e.g. `@aanyacreates`)
    - Email Address
    - Password (with show/hide visibility toggle)
  - CTA Button: `Create Free Account`
  - Terms of Service & Privacy Policy acceptance notice.
  - Sign-in redirect link: *"Already have an account? Log in"*.
- **Right Column (55%, Hidden on small mobile)**:
  - Gradient backdrop (`bg-gradient-to-br from-indigo-50/50 via-teal-50/30 to-purple-50/50`).
  - Isometric floating showcase:
    - High-res preview of the Creator Hero Card.
    - Live Money Leak Radar chip: *"Perpetual rights flagged (+₹50,000 protected)"*.
    - Payment received notification: *"Nykaa Fashion paid ₹85,000"*.

### B. Sign-In Experience (`/login`)
- Clean, focused, centered single-card layout (`max-w-md w-full mx-auto`).
- Official Kreato K-symbol.
- Heading: *"Welcome back"*
- Form Fields:
  - Email Address
  - Password (with password visibility toggle)
  - Quick action: *"Forgot password?"*
  - "Demo One-Click Fill" button to test the experience immediately without hurdles.
- CTA Button: `Sign In to Kreato`
- Footer link: *"Don't have an account? Sign up for free"*.

### C. Forgot / Reset Password Flow (`/forgot-password`)
- Clean modal or dedicated minimal route for password reset link delivery with instant success feedback.

---

## 5. File Structure & Component Boundaries

All new work will strictly reside in isolated marketing/auth modules and will **never touch or disrupt existing dashboard routes**:

```
frontend/
├── components/
│   ├── marketing/
│   │   ├── MarketingNav.tsx           # Floating responsive navbar
│   │   ├── HeroSection.tsx            # Hero with floating deal/leak cards
│   │   ├── FloatingShowcase.tsx       # Interactive dashboard + deal cards mockup
│   │   ├── ValueStrip.tsx             # 3-step value flow
│   │   ├── FeatureSection.tsx         # Reusable alternating feature row
│   │   ├── CopilotDarkSection.tsx     # Obsidian AI showcase with chips
│   │   ├── PricingSection.tsx         # 3-tier creator pricing table
│   │   ├── TestimonialsSection.tsx    # Trust & verified workflow cards
│   │   ├── FaqSection.tsx             # Accordion FAQs
│   │   ├── FinalCtaBanner.tsx         # Pre-footer call to action
│   │   └── MarketingFooter.tsx        # Responsive multi-column footer
│   └── auth/
│       ├── SignUpForm.tsx             # Two-column registration experience
│       ├── SignInForm.tsx             # Minimal centered login experience
│       └── ForgotPasswordForm.tsx     # Password recovery interface
app/
├── page.tsx                           # Replaced to serve Public Marketing Landing Page
├── login/
│   └── page.tsx                       # Dedicated /login route
├── signup/
│   └── page.tsx                       # Dedicated /signup route
└── forgot-password/
    └── page.tsx                       # Dedicated /forgot-password route
```

> [!NOTE]
> The existing `/dashboard`, `/deals`, `/inbox`, `/radar`, `/contracts`, `/invoices`, and `/ledger` routes will remain 100% intact and untouched. The landing page and auth will smoothly route users into `/dashboard`.
