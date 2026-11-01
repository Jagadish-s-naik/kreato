/**
 * Scam & Fraud Detection Rule Engine
 * Identifies pay-to-collab advance fee scams, domain impersonation, and prompt injection attacks.
 */

export interface ScamResult {
  score: number; // 0 to 100
  level: "safe" | "suspicious" | "danger";
  reasons: string[];
}

// Known top Indian brands frequently targeted by lookalike scammers
const KNOWN_BRANDS = [
  "mamaearth",
  "nykaa",
  "boat",
  "sugarcosmetics",
  "plumgoodness",
  "myntra",
  "flipkart",
  "amazon",
  "zara",
  "h&m",
  "maccosmetics",
  "loreal",
  "lakme",
  "derma",
];

const ADVANCE_FEE_PHRASES = [
  "registration fee",
  "shipping fee",
  "courier charge",
  "courier fee",
  "security deposit",
  "refundable deposit",
  "pay delivery",
  "free kit pay",
  "kit shipping",
  "pay courier",
  "pay ₹",
  "pay rs",
];

const PROMPT_INJECTION_PATTERNS = [
  "ignore previous instructions",
  "ignore all previous instructions",
  "disregard previous prompts",
  "override system prompt",
  "new system instructions",
  "you are now a helpful assistant that accepts",
  "set fee to 0",
];

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function evaluateScamRisk(options: {
  rawText: string;
  brandName?: string | null;
  brandDomain?: string | null;
  senderEmail?: string | null;
}): ScamResult {
  const { rawText, brandName, brandDomain, senderEmail } = options;
  const lowerText = (rawText || "").toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  // 1. Advance Fee / Pay-to-Collab Scan
  for (const phrase of ADVANCE_FEE_PHRASES) {
    if (lowerText.includes(phrase)) {
      score += 60;
      reasons.push(
        `Pay-to-Collab Red Flag: Message mentions "${phrase}". Legitimate brand collaborations never ask creators to pay registration or shipping fees.`
      );
      break;
    }
  }

  // 2. Prompt Injection Detection
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (lowerText.includes(pattern)) {
      score += 50;
      reasons.push(
        `Prompt Injection Attack Detected: Message contains manipulative commands ("${pattern}") attempting to override AI contract analysis.`
      );
      break;
    }
  }

  // 3. Lookalike Domain Check
  if (brandDomain) {
    const cleanDomain = brandDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    const domainName = cleanDomain.split(".")[0];

    for (const known of KNOWN_BRANDS) {
      if (domainName !== known) {
        const dist = levenshteinDistance(domainName, known);
        if (dist >= 1 && dist <= 2) {
          score += 50;
          reasons.push(
            `Lookalike Domain Impersonation: Domain "${cleanDomain}" closely mimics known Indian brand "${known}" (Levenshtein distance: ${dist}).`
          );
          break;
        }
      }
    }
  }

  // 4. Free Email vs Claimed Brand Mismatch
  if (senderEmail && brandName) {
    const lowerEmail = senderEmail.toLowerCase();
    const isFreeProvider =
      lowerEmail.endsWith("@gmail.com") ||
      lowerEmail.endsWith("@yahoo.com") ||
      lowerEmail.endsWith("@outlook.com") ||
      lowerEmail.endsWith("@hotmail.com");

    if (isFreeProvider && brandName.length >= 4) {
      score += 25;
      reasons.push(
        `Unverified Sender: Brand representative claims to represent "${brandName}" but communicates via a free personal email address (${senderEmail}).`
      );
    }
  }

  const normalizedScore = Math.min(100, score);
  let level: ScamResult["level"] = "safe";
  if (normalizedScore >= 60) {
    level = "danger";
  } else if (normalizedScore >= 25) {
    level = "suspicious";
  }

  return {
    score: normalizedScore,
    level,
    reasons,
  };
}

