/**
 * Central application branding and configuration.
 * Change APP_NAME here to rebrand the entire application.
 */
export const APP_NAME = "DealShield";
export const APP_TAGLINE = "Income protection and payment automation for Indian creators";

export const APP_CONFIG = {
  name: APP_NAME,
  tagline: APP_TAGLINE,
  currency: "INR",
  currencySymbol: "₹",
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  legalDisclaimer: "Summary of agreed terms in chat. Not a legal contract.",
  taxDisclaimer: "Sample invoice calculation. Please verify GST/TDS provisions with a certified Chartered Accountant or on the official GST portal.",
  memoValidityDays: 14,
  maxOcrImageSizeMb: 8,
  aiRateLimitMaxRequests: 20,
  aiRateLimitWindowMinutes: 10,
} as const;

