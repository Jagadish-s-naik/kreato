/**
 * Client-Side & Backend PII Tokenization Engine
 * Strips phone numbers, emails, UPI IDs, PAN, and GSTIN before sending untrusted text to LLMs.
 */

export interface TokenizeResult {
  maskedText: string;
  tokenMap: Record<string, string>; // e.g. { "[PHONE_1]": "9876543210" }
}

export function tokenizePII(rawText: string): TokenizeResult {
  if (!rawText) return { maskedText: "", tokenMap: {} };

  const tokenMap: Record<string, string> = {};
  let masked = rawText;

  let phoneCounter = 1;
  let emailCounter = 1;
  let upiCounter = 1;
  let panCounter = 1;
  let gstinCounter = 1;

  // 1. Mask GSTIN (15 characters: e.g. 27AAAAA0000A1Z5)
  masked = masked.replace(
    /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/gi,
    (match) => {
      const token = `[GSTIN_${gstinCounter++}]`;
      tokenMap[token] = match;
      return token;
    }
  );

  // 2. Mask PAN Card (e.g. ABCDE1234F)
  masked = masked.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi, (match) => {
    const token = `[PAN_${panCounter++}]`;
    tokenMap[token] = match;
    return token;
  });

  // 3. Mask Email addresses
  masked = masked.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    (match) => {
      const token = `[EMAIL_${emailCounter++}]`;
      tokenMap[token] = match;
      return token;
    }
  );

  // 4. Mask UPI VPAs (e.g. user@okaxis, brand.collab@ybl, pay@okhdfcbank)
  masked = masked.replace(
    /\b[a-zA-Z0-9.\-_]{2,256}@(okhdfcbank|okaxis|okicici|oksbi|ybl|ibl|paytm|axl|apl|upi)\b/gi,
    (match) => {
      const token = `[UPI_${upiCounter++}]`;
      tokenMap[token] = match;
      return token;
    }
  );

  // 5. Mask Indian 10-digit mobile phone numbers (+91, 0, or raw 6-9)
  masked = masked.replace(
    /(?:(?:\+?91[\s.-]?)?|0)?([6-9]\d{4}[\s.-]?\d{5})\b/g,
    (match) => {
      const token = `[PHONE_${phoneCounter++}]`;
      tokenMap[token] = match;
      return token;
    }
  );

  return { maskedText: masked, tokenMap };
}

/**
 * Restores masked tokens back into raw text for authenticated creator view.
 */
export function detokenizePII(
  maskedText: string,
  tokenMap: Record<string, string>
): string {
  if (!maskedText || !tokenMap) return maskedText;

  let restored = maskedText;
  for (const [token, original] of Object.entries(tokenMap)) {
    restored = restored.split(token).join(original);
  }
  return restored;
}

