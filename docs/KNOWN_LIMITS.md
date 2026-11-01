# Known Limitations & Explicit Boundaries — Kreato

In accordance with our strict non-negotiable rules, Kreato maintains complete transparency regarding architectural boundaries, simulated datasets, third-party platform limitations, and legal scopes. Nothing is faked or mocked under the hood.

---

## 1. Simulated Benchmark Data
- **Status**: Simulated and clearly labeled.
- **Details**: The benchmark catalog (`benchmarks` table) contains realistic baseline rates across creator niches (skincare, tech, finance, etc.), follower bands (nano, micro, mid, macro), and deliverable formats (reels, stories, videos).
- **Mandatory Label**: Every UI element deriving numbers from this table displays the label:
  > *"Simulated benchmark data"*
- **Production Path**: In a commercial production rollout, this simulated table would be replaced by real-time aggregated anonymized survey data from verified Indian creator payouts.

---

## 2. Calendar Integration Scope (No Two-Way OAuth Sync)
- **Status**: Zero-setup export via `.ics` download and web links only.
- **Boundaries**:
  - Full two-way calendar sync (OAuth 2.0 with write access to Google Calendar or Apple iCloud) is **intentionally NOT implemented**.
  - Instead, Kreato generates RFC 5545 compliant `.ics` files and 1-click template web links (`calendar.google.com/calendar/render?action=TEMPLATE...`).
- **Reasoning**: Eliminates invasive Google Calendar OAuth permission requests, user friction, and consent barriers while still placing key delivery deadlines and invoice due dates directly on the creator's schedule.

---

## 3. YouTube Public Data & Instagram Stats Boundaries
- **Status**: Public channel data via API key only; Instagram stats not available.
- **Boundaries**:
  - YouTube stats lookup uses public endpoints (`channels.list`) with a server-side `YOUTUBE_API_KEY`. No creator channel login or OAuth permissions are requested.
  - **Instagram Statistics**: Follower counts and engagement stats for Instagram are **NOT** available through this method, as Meta Graph API requires app review, business account conversion, and OAuth permissions.
  - Follower band suggestions derived from YouTube must be explicitly confirmed by the creator before updating their profile.

---

## 4. Gmail Import Beta (Google Test Users Only)
- **Status**: Restricted beta requiring Google OAuth test user authorization.
- **Boundaries**:
  - Gmail Import is currently restricted to authorized Google test users registered in Google Cloud Console.
  - Until Kreato completes formal Google OAuth verification and a third-party CASA Tier 2 security assessment for the restricted `gmail.readonly` scope, external users attempting connection will encounter Google's "unverified app" screen.
  - **Zero Dependency**: Kreato's core functionality (deal analysis, Radar, Ladder, invoicing) remains 100% accessible via paste text and screenshot OCR without connecting Gmail.

---

## 5. In-Browser OCR & Device Memory Boundaries
- **Status**: Privacy-first client-side execution.
- **Details**: `tesseract.js` (eng+hin) runs entirely inside the user's browser Web Worker to ensure screenshot images are never transmitted to our servers or stored on disk.
- **Limitations**:
  - Requires initial client-side download of Tesseract trained data language files (~15–20 MB).
  - On low-end mobile devices, processing 4K screenshots may take 3–5 seconds. The app downscales images larger than 1600px before OCR.

---

## 6. Legal Status of Deal Memos
- **Status**: Operational summary, not formal legal counsel.
- **Mandatory Disclaimer**: Every Deal Memo PDF and public acceptance portal carries the footer:
  > *"Summary of terms agreed in chat. Not a legal contract."*
- **Legal Scope**: While email/chat confirmations have evidential value under the Indian Evidence Act, this document does not replace formal bilateral agreements executed on stamp paper or with e-Sign/Aadhaar OTP.

---

## 7. Tax & Invoicing Disclaimers
- **Status**: Standard sample calculation engine.
- **Mandatory Disclaimer**: Every invoice carries the notice:
  > *"Sample invoice calculation. Please verify GST/TDS provisions with a certified Chartered Accountant or on the official GST portal."*
- **Limitations**: The system does not file GSTR-1/GSTR-3B on the GST portal or remit TDS under Section 194J/194C.

---

## 8. No Automated Outbound Messaging
- **Status**: Strict user-in-the-loop design.
- **Details**: The application **never** dispatches messages autonomously via WhatsApp Business API, Instagram Graph API, or SMTP. The AI only proposes; outbound transmission strictly requires creator click on **"Open WhatsApp"** or **"Open in Email Client"**.
