# Test Plan & Verification Strategy — Kreato

This document defines the unit tests, end-to-end golden flow, and manual QA checklist for Kreato.

---

## 1. Automated Unit Test Catalog (Vitest)

All tests are located in `tests/unit/` and execute in under 5 seconds with zero external dependencies.

| Test Suite | File Path | Focus & Coverage |
| :--- | :--- | :--- |
| **Radar Engine** | `tests/unit/radar.test.ts` | Golden numbers from `RADAR_SPEC.md`: Fair fee, Benchmark gap, Usage % tiers, Payment delay financing math, Exclusivity pro-rating, Brand delay penalty. |
| **Walk-away Ladder** | `tests/unit/ladder.test.ts` | Ideal (fair + usage), Acceptable (0.9x), Walk-away (floor or 0.7x), tier reasons, below-floor warning text. |
| **Exclusivity Guard** | `tests/unit/exclusivity.test.ts` | Active date interval overlap, category matching, boundary dates (same day vs next day), IST timezone consistency. |
| **Scam Detection** | `tests/unit/scam.test.ts` | Pay-to-collab phrases, free email domain claiming big brand, Levenshtein distance on typosquatting, prompt-injection patterns, clean email control. |
| **PII Masking** | `tests/unit/mask.test.ts` | Indian phone numbers (+91, spaced, 10-digit), RFC emails, UPI VPAs, PAN, GSTIN tokenization and round-trip restoration. |
| **GST Engine** | `tests/unit/gst.test.ts` | Unregistered supplier vs registered, intra-state CGST (9%) + SGST (9%), inter-state IGST (18%), sequential FY numbering (`DS/2026-27/001`). |
| **UPI Link & QR** | `tests/unit/upi.test.ts` | Valid `upi://pay` URI parameters (pa, pn, am, cu=INR, tn), QR code payload generation. |
| **Brand Ledger** | `tests/unit/ledger.test.ts` | Brand key normalization, avg days late calculation, past concessions aggregation. |
| **Clock Simulator** | `tests/unit/clock.test.ts` | `sim_days_offset` arithmetic, effective date computation, overdue threshold flags. |
| **Currency & Numbers** | `tests/unit/currency.test.ts` | en-IN locale formatting (`₹1,23,456`), parsing Indian number notations ("30k", "30,000", "₹30000/-", "teen hazaar"). |
| **RLS Isolation** | `tests/unit/rls.test.ts` | Two-user isolation verification (User A cannot read/mutate User B's rows, zero-client policy on gmail_connections). |
| **Calendar Engine** | `tests/unit/calendar.test.ts` | RFC 5545 compliant `.ics` generation, UTF-8 octet-safe 75-char folding, CRLF endings, exclusive all-day `DTEND`, Hindi & ₹ character escaping, stable UIDs, Google Calendar URL encoding. |
| **YouTube Verification** | `tests/unit/youtube.test.ts` | Channel input parsing (@handle, full URLs, IDs), strict hostname allowlist, subscriber-to-band mapping thresholds, error handling (quota, private sub counts). |
| **Gmail Import Engine** | `tests/unit/gmail.test.ts` | AES-256-GCM token encryption roundtrip, tamper auth tag check, HTML sanitization, sponsorship relevance scoring, deduplication via `deals.source_ref`. |

---

## 2. Playwright E2E Golden Flow (`tests/e2e/golden-flow.spec.ts`)

The golden-flow test automates the complete creator journey against the real running application:
1. **Login**: Authenticates Creator A.
2. **Inbox Ingestion**: Pastes sample Hinglish brand offer from "GlowSkin".
3. **Copilot Extraction**: Verifies extracted brand name, deliverables (1 Reel + 2 Stories), fee (₹25,000), usage rights, and payment terms.
4. **Radar Verification**: Verifies live animated "₹ at risk" counter ticks up to expected golden total.
5. **Ladder Negotiation**:
   - Selects "Ideal" tier in Hinglish.
   - Generates counter-offer draft.
   - Verifies draft contains precomputed fee (₹45,000).
   - Approves counter-offer; verifies deal status transitions to `countered`.
   - Confirms WhatsApp button links to `wa.me` with prefilled text.
6. **Deal Memo Generation**:
   - Marks deal as agreed.
   - Generates Deal Memo PDF.
   - Copies public acceptance token link (`/memo/[token]`).
7. **Brand Acceptance**:
   - Opens `/memo/[token]` in unauthenticated browser context.
   - Enters signatory name ("Pooja Sharma - Marketing Head").
   - Clicks "I Agree to Terms".
   - Verifies creator dashboard updates deal status to `agreed`.
8. **Exclusivity Guard Check**:
   - Creates a second incoming offer for another skincare brand within the active 60-day window.
   - Confirms red Exclusivity Guard warning card appears.
9. **Invoicing & UPI**:
   - Generates GST invoice with sequential FY number (`DS/2026-27/001`).
   - Verifies CGST + SGST tax split and scannable UPI QR code.
10. **Time-Travel Simulation**:
    - Navigates to Settings and clicks **"Advance 30 Days"**.
    - Returns to deal page; verifies invoice is flagged as overdue.
    - Generates and verifies escalating reminder draft.
11. **Payment Settlement**:
    - Clicks "Mark as Paid" with actual receipt date.
    - Verifies deal moves to `paid`.
    - Checks Personal Brand Ledger: verifies GlowSkin metrics reflect updated payment latency.

---

## 3. Manual QA Checklist

- [ ] **Mobile Responsiveness**: Test `/inbox`, `/deals/[id]`, and `/settings` on 375px mobile viewport.
- [ ] **Client-Side Redaction**: Upload blurry screenshot, draw black bounding box over sensitive details, and verify clean redaction preview.
- [ ] **Rate Limiter**: Fire 21 rapid extraction requests; verify friendly rate-limit banner on request 21.
- [ ] **Disclaimer Visibility**: Verify legal and tax disclaimers are present on all PDF downloads and memo portals.
- [ ] **Data Export**: Download JSON export from `/settings` and verify schema completeness.
- [ ] **Data Deletion**: Type `"DELETE ALL"` in settings; verify all creator rows are removed from Supabase.

