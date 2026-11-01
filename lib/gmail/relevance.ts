/**
 * Gmail Sponsorship Relevance & Brand Offer Heuristics
 * In-memory deterministic scoring to identify high-probability brand deals.
 */

export interface RelevanceScoreResult {
  isLikelyBrandOffer: boolean;
  score: number; // 0 to 100
  reasons: string[];
}

const HIGH_INTENT_SUBJECT_WORDS = [
  "collab",
  "collaboration",
  "sponsor",
  "sponsorship",
  "partnership",
  "campaign",
  "brand deal",
  "paid collab",
  "commercials",
  "influencer",
  "creator partnership",
];

const COMMERCIAL_BODY_WORDS = [
  "budget",
  "deliverables",
  "deliverable",
  "reel",
  "stories",
  "story",
  "commercials",
  "remuneration",
  "usage rights",
  "exclusivity",
  "net-30",
  "net-60",
  "payment terms",
  "₹",
  "inr",
  "payout",
  "rates",
];

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "rediffmail.com",
]);

export function assessEmailRelevance(
  subject: string = "",
  snippet: string = "",
  senderEmail: string = ""
): RelevanceScoreResult {
  const subLower = subject.toLowerCase();
  const snipLower = snippet.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  // 1. Subject line analysis
  let subjectMatches = 0;
  for (const word of HIGH_INTENT_SUBJECT_WORDS) {
    if (subLower.includes(word)) {
      subjectMatches++;
      if (reasons.length < 3) {
        reasons.push(`Subject mentions "${word}"`);
      }
    }
  }
  if (subjectMatches > 0) {
    score += Math.min(45, subjectMatches * 25);
  }

  // 2. Commercial terms in snippet / body
  let bodyMatches = 0;
  for (const word of COMMERCIAL_BODY_WORDS) {
    if (snipLower.includes(word)) {
      bodyMatches++;
      if (reasons.length < 3 && !reasons.some((r) => r.includes(word))) {
        reasons.push(`Mentions commercial term "${word}"`);
      }
    }
  }
  if (bodyMatches > 0) {
    score += Math.min(40, bodyMatches * 15);
  }

  // 3. Sender domain evaluation
  if (senderEmail && senderEmail.includes("@")) {
    const domain = senderEmail.split("@")[1].toLowerCase().trim();
    if (domain && !FREE_EMAIL_DOMAINS.has(domain)) {
      score += 20;
      reasons.push(`Sent from corporate domain (@${domain})`);
    }
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  return {
    isLikelyBrandOffer: score >= 40,
    score,
    reasons: reasons.slice(0, 3),
  };
}

