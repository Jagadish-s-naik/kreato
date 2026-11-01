# Product Requirements Document (PRD) — DealShield

## 1. Executive Summary & One-Line Pitch
> **One-line pitch**: We protect Indian creators' income before they say yes to a deal, then automate the follow-through until they are paid.

DealShield is a specialized income defense and deal follow-through automation platform built exclusively for Indian content creators (10k to 500k followers). It intercepts brand offers received via WhatsApp, Instagram DMs, and emails, evaluates financial terms against deterministic benchmark and risk formulas, equips creators with non-negotiable walk-away ladders and AI-assisted counter-offers, and seals agreed terms with tamper-evident Deal Memos and GST/UPI invoices.

---

## 2. Problem Statement
The Indian creator economy is exploding, but solo creators operate with zero legal, financial, or agency infrastructure:
1. **Underpricing & Information Asymmetry**: Brands offer arbitrary fees (e.g., ₹15,000 for deliverables worth ₹45,000 in market benchmarks). Creators lack transparent benchmark data.
2. **Hidden Rights & Perpetual Exploitation**: Brands bury "perpetual digital usage", "whitelisting rights", or "unlimited ad rights" inside informal chat messages without paying usage royalties.
3. **Severe Payment Delays & Financing Costs**: Terms like "net-60" or "net-90" are common, and brands routinely pay 30–60 days beyond agreed dates. Creators bear inflation, opportunity cost, and cash-flow crunches with zero financing compensation.
4. **Uncompensated Exclusivity**: Brands demand 30–90 days category exclusivity (e.g. "no other skincare promotions"), blocking other revenue streams without fair remuneration.
5. **Scams & Advance-Fee Fraud**: Impersonators use lookalike brand domains (`@nykaa-collab.in`) or demand registration/shipping fees ("Pay ₹999 security deposit for free kit").
6. **Follow-Through Fatigue**: Creators hate chasing late payments; they fear ruining brand relationships, leading to polite delays and ultimately bad debt.

---

## 3. User Persona
- **Primary Persona**: The Solo Indian Content Creator
  - **Audience Size**: 10,000 to 500,000 followers on Instagram and YouTube.
  - **Niches**: Skincare, Beauty/Makeup, Fashion, Tech & Gadgets, Fitness, Food & Beverage, Finance, Gaming, Travel, Education.
  - **Deal Channels**: WhatsApp chats, Instagram DMs, and personal Gmail/business email.
  - **Operations**: Operates alone or with a sibling/friend; does not have an agency manager or a retained lawyer; uses UPI for payments; may or may not be GST-registered.
  - **Pain Point**: Needs to look professional, avoid getting scammed, earn fair rates, and get paid on time without awkward personal friction.

---

## 4. Product Scope

### In Scope
1. **Deal Ingestion & Privacy**: Ingest text or screenshots. In-browser Tesseract OCR with client-side PII masking before data reaches servers. Redaction canvas fallback.
2. **Deal Copilot (Extraction)**: Structured extraction via Google Gemini using strict JSON schemas and prompt-injection-safe `<message>` isolation.
3. **Personal Brand Ledger**: Repeat-brand analytics (historical delay, average days late, previous accepted terms, duplicate brand merging).
4. **Money Leak Radar**: Deterministic financial calculation engine for benchmark fee gaps, usage rights add-ons, financing delay interest, exclusivity fees, and brand delay penalties.
5. **Walk-away Ladder & Counter Drafter**: Pure code-computed 3-tier matrix (Ideal, Acceptable, Walk-away) with Gemini drafting polite English/Hinglish negotiation messages strictly constrained to precomputed figures.
6. **Deal Memo & Public Accept Portal**: One-page PDF generated via `@react-pdf/renderer` with public token-hashed acceptance link (`/memo/[token]`).
7. **Exclusivity Guard**: Date and category conflict engine checking against existing active campaigns.
8. **GST Invoice & UPI Engine**: Sequential financial-year invoicing (CGST/SGST vs IGST) with standard 18% GST and dynamic UPI QR code.
9. **Payment Tracking & Time-Travel Simulator**: Overdue tracking with simulated clock controls (`sim_days_offset`), escalating reminder drafts (friendly, firm, final), and payment reconciliation.
10. **Scam Detection Engine**: Rule-based scoring identifying pay-to-collab, lookalike domains, free email mismatches, and injection attacks.
11. **Security & Data Ownership**: Full Supabase Row Level Security (RLS), append-only audit logging, user data export, and full deletion.

### Out of Scope (Non-Goals)
- **Not a Creator CRM / Agency Management Tool**: No multi-creator team permissions or agency rosters.
- **Not a Legal Contract or Law Firm**: Deal Memos explicitly state: *"Summary of agreed terms in chat. Not a legal contract."*
- **Not a Tax Filing / CA Portal**: Invoices include disclaimers to verify GST/TDS with official portals or a certified CA.
- **No Automated Outbound Messaging**: The system never sends WhatsApps or emails directly. The AI proposes; the creator approves, which opens native `wa.me` links or `mailto:` pre-fills.
- **No Brand Accounts**: Brands never sign up or access the database. They interact only through single-purpose public memo accept links.

---

## 5. Success Criteria & Metrics
- **Extraction Accuracy**: >= 95% on realistic messy Hinglish and English brand messages.
- **Deterministic Integrity**: 100% of money, dates, taxes, and ladder calculations handled by pure TypeScript in `/lib`, verified by automated tests against golden numbers.
- **Security & Privacy**: Zero unmasked PII (phone, email, UPI, PAN) sent to the LLM during standard text flow.
- **User Trust**: Clear labels on simulated benchmark data, transparent formulas for every rupee calculated, and full creator approval gates on all actions.
- **Performance**: Instant (<100ms) client-side Radar recalculations on deal card adjustments.
