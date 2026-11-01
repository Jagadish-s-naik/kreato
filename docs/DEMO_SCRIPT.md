# 90-Second Demo Script — Kreato

This script outlines the high-impact, live demonstration of Kreato for hackathon presentations and creator onboarding.

---

## 1. Demo Narrative & Persona Setup
- **Creator**: Simran (Skincare & Lifestyle Creator, 75,000 followers, based in Mumbai).
- **The Situation**: A brand rep DMs Simran on WhatsApp offering a collaboration for their new Vitamin C serum.

---

## 2. Step-by-Step 90-Second Walkthrough

### 0:00 – 0:15: The Messy Ingestion (Inbox)
1. **Action**: Open `/inbox`.
2. **Action**: Paste the following real-world messy Hinglish WhatsApp message:
   ```text
   Hey Simran! Loved your latest monsoon skincare reel ❤️
   We are launching our new GlowSkin Vitamin C Glow Serum and want to collaborate with you!
   Deliverables will be 1 IG Reel + 2 Stories with link stickers.
   Commercials we can offer is ₹25,000 all inclusive.
   Usage: Brand will whitelist and run ads for 6 months across meta.
   Exclusivity: 60 days no other skincare brand collaborations.
   Payment terms: Net-60 days after invoice.
   Let us know if you can deliver by 25th Nov. Email your confirmation to pooja@glowskin-collab.in or WhatsApp on +91 98200 12345.
   ```
3. **Show**: Live client-side PII masking instantly masks the phone and email before transmission.
4. **Click**: **"Audit Deal"**.

---

### 0:15 – 0:35: Extraction & The Money Leak Radar
1. **Show**: Deal Copilot card opens at `/deals/[id]`.
   - Brand: **GlowSkin**
   - Category: **Skincare**
   - Deliverables: **1 Reel + 2 Stories**
   - Offered Fee: **₹25,000**
2. **Show**: Personal Brand Ledger panel:
   - *"GlowSkin previously paid you 47 days late. You accepted perpetual usage in that deal."*
3. **Show**: The Money Leak Radar counter ticks up live with Framer Motion:
   - **Fair Market Fee**: **₹45,000** *(Based on simulated benchmark data)*
   - **Benchmark Gap**: **₹20,000**
   - **Usage Surcharge (6 mo ads)**: **₹9,000**
   - **Payment Delay (Net-60 + risk premium)**: **₹1,054.79**
   - **Exclusivity Leak (60 days)**: **₹13,500**
   - **Brand History Penalty (47 days late)**: **₹579.45**
   - **Total ₹ at Risk**: **₹44,134.24**

---

### 0:35 – 0:50: The Walk-away Ladder & Counter-Offer
1. **Action**: Scroll to the Walk-away Ladder.
2. **Select**: **"Ideal Tier"** (Counter Fee: **₹45,000**, Organic usage only, Net-15 payment, Exclusivity removed).
3. **Select Language**: **Hinglish**.
4. **Click**: **"Draft Counter-Offer"**.
5. **Show**: Gemini generates polite, professional Hinglish draft:
   > *"Hey Pooja! Thanks so much for reaching out, loved the serum concept. For 1 Reel + 2 Stories, my standard commercial is ₹45,000 for organic posting with net-15 payment terms. Since 60 days exclusivity restricts other campaigns, we can either remove exclusivity or add the standard category fee. Let me know if this works so I can block 25th Nov on my calendar!"*
6. **Click**: **"Approve Counter"**.
7. **Show**: **Copy**, **Open WhatsApp** (`wa.me`), and **Open Email** buttons appear. Radar updates: **"₹20,000 Recovered"** badge glows green.

---

### 0:50 – 1:10: Deal Memo & Public Brand Sign-off
1. **Click**: **"Mark as Agreed"**.
2. **Show**: Generates clean one-page Deal Memo PDF with legal disclaimer.
3. **Action**: Copy the secure public link (`/memo/7f9a...`).
4. **Action**: Open incognito tab (Brand perspective).
5. **Show**: Brand sees clean summary of terms, types *"Pooja Sharma"*, and clicks *"I Agree to Terms"*.
6. **Switch back**: Creator dashboard instantly reflects deal status **"Agreed"**.

---

### 1:10 – 1:30: GST Invoice, UPI QR & Time-Travel Overdue Reminder
1. **Click**: **"Generate GST Invoice"**.
2. **Show**: Sequential invoice `DS/2026-27/001`, Maharashtra intra-state CGST (9%) + SGST (9%), and scannable UPI QR code.
3. **Action**: Go to Settings, click **"Advance 30 Days"**.
4. **Show**: Deal is now overdue!
5. **Click**: **"Draft Reminder"** -> Generates escalating firm reminder citing invoice number, ₹ amount, and due date.
6. **Click**: **"Mark as Paid"** -> Payment recorded, deal marked settled, and Brand Ledger updated.

---

### 1:30 – 1:45: Calendar Export (Feature 12 — Zero Setup, No OAuth)
1. **Action**: On the deal page (`/deals/[id]`), scroll to the **Calendar Export** widget.
2. **Click**: **"Download .ics"** -> Instantly downloads `deal-glowskin-deliv.ics` containing delivery deadline, exclusivity window, and payment due date with RFC 5545 compliance and alarm reminders.
3. **Click**: **"Add to Google Calendar"** -> Directly opens a pre-populated Google Calendar event creation tab in the browser (zero consent screens or OAuth tokens required).

---

### 1:45 – 2:00: Optional Enhancements (YouTube Stats & Gmail Import Beta)
1. **YouTube Channel Verification (Feature 13 — Public API Key Only)**:
   - Creator opens `/settings`.
   - Pastes their public handle `@simranlifestyle` (or channel URL).
   - Kreato queries YouTube Data API v3 and displays public subscriber count, view counts, and auto-suggests the verified follower band (e.g. *Mid-tier (50k–200k)*).
   - Creator confirms or retains their manually chosen benchmark band.
2. **Gmail Import Beta (Feature 14 — Test Users Only)**:
   - Creator visits `/inbox` and switches to the **"Connect Gmail (beta)"** tab.
   - Banner clearly states: *"Test users only. Paste and screenshot work without connecting Gmail."*
   - Searches for `from:glowskin`.
   - Kreato scans subject lines, flags relevant sponsorship threads, sanitizes HTML, and extracts the deal using Gemini Copilot without ever storing raw emails.


