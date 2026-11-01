/**
 * Configuration constants for Money Leak Radar & Walk-away Ladder
 * Reference: docs/RADAR_SPEC.md
 */
export const RADAR_CONFIG = {
  baselinePaymentDays: 15,
  annualFinancingRate: 0.18, // 18% annual financing interest
  daysInYear: 365,
  riskPremiumThresholdDays: 30,
  riskPremiumPerBlockPercent: 0.02, // 2% per 30-day block beyond 30 days
  riskBlockSizeDays: 30,
  exclusivityRatePer30Days: 0.15, // 15% of fair fee per 30 days
  maxExclusivityCapPercent: 1.0, // Maximum 100% cap
  usageRates: {
    none: 0.0,
    organic: 0.0,
    paidAdsMonths3: 0.1, // 10% for <= 3 months
    paidAdsMonths6: 0.2, // 20% for 4-6 months
    paidAdsMonths12: 0.4, // 40% for 7-12 months
    perpetualOrUnspecified: 1.0, // 100% for perpetual or unspecified
  },
} as const;

