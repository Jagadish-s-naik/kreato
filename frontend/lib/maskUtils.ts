export interface MaskedResult {
  maskedText: string;
  tokens: { token: string; type: string; original: string }[];
}

export function maskPii(text: string): MaskedResult {
  let maskedText = text;
  const tokens: { token: string; type: string; original: string }[] = [];

  // 1. Indian Phone Numbers (e.g. +91 9876543210, 98765 43210, etc.)
  const phoneRegex = /(\+91[\-\s]?)?[6-9]\d{9}/g;
  let phoneCount = 1;
  maskedText = maskedText.replace(phoneRegex, (match) => {
    const token = `[PHONE_${phoneCount++}]`;
    tokens.push({ token, type: "phone", original: match });
    return token;
  });

  // 2. Email Addresses
  const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g;
  let emailCount = 1;
  maskedText = maskedText.replace(emailRegex, (match) => {
    const token = `[EMAIL_${emailCount++}]`;
    tokens.push({ token, type: "email", original: match });
    return token;
  });

  // 3. UPI VPAs (e.g. user@okaxis, handle@icici)
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g;
  let upiCount = 1;
  maskedText = maskedText.replace(upiRegex, (match) => {
    // Avoid double-masking already converted [EMAIL_1]
    if (match.startsWith("[") && match.endsWith("]")) return match;
    const token = `[UPI_${upiCount++}]`;
    tokens.push({ token, type: "upi_vpa", original: match });
    return token;
  });

  return { maskedText, tokens };
}

