# Known Limitations & Explicit Boundaries — DealShield

In accordance with our strict non-negotiable rules, DealShield maintains complete transparency regarding architectural boundaries, simulated datasets, and legal scopes. Nothing is faked or mocked under the hood.

---

## 1. Simulated Benchmark Data
- **Status**: Simulated and clearly labeled.
- **Details**: The benchmark catalog (`benchmarks` table) contains realistic, plausible baseline rates across creator niches (skincare, tech, finance, etc.), follower bands (nano, micro, mid, macro), and deliverable formats (reels, stories, videos).
- **Transparency**: Every UI element deriving numbers from this table displays the label:
  > *"Based on simulated benchmark data"*
- **Production Path**: In a commercial production rollout, this simulated table would be replaced by real-time aggregated anonymized survey data from verified Indian creator payouts.

---

## 2. In-Browser OCR & Device Memory Boundaries
- **Status**: Privacy-first client-side execution.
- **Details**: `tesseract.js` (eng+hin) runs entirely inside the user's browser Web Worker to ensure screenshot images are never transmitted to our servers or stored on disk.
- **Limitations**:
  - Requires initial client-side download of Tesseract trained data language files (~15–20 MB).
  - On low-end mobile devices with tight RAM limits, processing 4K screenshots may take 3–5 seconds. The app automatically downscales images larger than 1600px before OCR.
  - Complex handwriting, heavy Instagram gradient stickers, or distorted memes may produce lower OCR confidence. In such cases, DealShield prompts the creator to use the **Canvas Redaction Tool** or directly paste the text.

---

## 3. Legal Status of Deal Memos
- **Status**: Operational summary, not formal legal counsel.
- **Details**: The generated Deal Memo PDF provides a clear, structured summary of terms agreed upon in chat (deliverables, usage period, payment deadline, exclusivity window).
- **Mandatory Disclaimer**: Every Deal Memo PDF and public acceptance portal carries the footer:
  > *"Summary of terms agreed in chat. Not a legal contract."*
- **Legal Scope**: While email/chat confirmations have evidential value under the Indian Evidence Act, this document does not replace formal bilateral agreements executed with stamp paper or digital signatures (e-Sign/Aadhaar OTP).

---

## 4. Tax & Invoicing Disclaimers
- **Status**: Standard sample calculation engine.
- **Details**: The GST invoice generator implements standard 18% GST (intra-state CGST 9% + SGST 9%, inter-state IGST 18%) under SAC code 998365 (promotional and advertising services).
- **Mandatory Disclaimer**: Every invoice carries the notice:
  > *"Sample invoice calculation. Please verify GST/TDS provisions with a certified Chartered Accountant or on the official GST portal."*
- **Limitations**:
  - The system does not file GSTR-1 or GSTR-3B on the GST portal.
  - TDS deduction (Section 194J/194C of the Income Tax Act) by corporate brands is not automatically remitted or reconciled against Form 26AS.

---

## 5. No Automated Outbound Messaging
- **Status**: Strict user-in-the-loop design.
- **Details**: The application **never** dispatches messages autonomously via WhatsApp Business API, Instagram Graph API, or SMTP.
- **Creator Autonomy**: The AI only drafts proposals. Outbound execution strictly requires the creator to click **"Open WhatsApp"** (which opens `wa.me/?text=...`) or **"Open Email"** (`mailto:?body=...`) with prefilled text in their native apps.

---

## 6. Public Acceptance Portal Rate Limiting
- **Status**: Unauthenticated public route protection.
- **Details**: The route `/memo/[token]` is accessible to brand representatives without requiring an account. To mitigate denial-of-service or token enumeration attacks, the route enforces IP-level rate limiting (maximum 10 requests per minute per IP address) and validates against a SHA-256 hash with a hard 14-day expiry.

