import { RADAR_CONFIG } from "./config/radar";

export interface DeliverableInput {
  format: string; // 'reel' | 'story' | 'post' | 'youtube_video' | 'short'
  quantity: number;
}

export interface UsageRightsInput {
  type: string; // 'none' | 'organic' | 'paid_ads' | 'perpetual' | 'unspecified'
  months?: number | null;
  paid_ads_allowed?: boolean;
}

export interface RadarInputs {
  deliverables: DeliverableInput[];
  benchmarkMedians: Record<string, number>; // format -> median_paise
  offeredFeePaise: number;
  usageRights?: UsageRightsInput;
  paymentDays?: number | null;
  exclusivityDays?: number | null;
  avgDaysLate?: number | null;
}

export interface RadarResult {
  fairFeePaise: number;
  benchmarkGapPaise: number;
  usageSurchargePaise: number;
  financingCostPaise: number;
  riskPremiumPaise: number;
  totalDelayCostPaise: number;
  exclusivityCostPaise: number;
  historyPenaltyPaise: number;
  totalAtRiskPaise: number;
  breakdown: {
    label: string;
    paise: number;
    formula: string;
    description: string;
  }[];
}

/**
 * Calculates fair fee from deliverables and benchmark median rates.
 */
export function computeFairFee(
  deliverables: DeliverableInput[],
  benchmarkMedians: Record<string, number>
): number {
  return deliverables.reduce((total, item) => {
    const rate = benchmarkMedians[item.format] || 0;
    const qty = Number(item.quantity ?? (item as any).count ?? 1) || 1;
    return total + qty * rate;
  }, 0);
}

/**
 * Benchmark Gap: max(0, Fair Fee - Offered Fee)
 */
export function computeBenchmarkGap(fairFeePaise: number, offeredFeePaise: number): number {
  return Math.max(0, fairFeePaise - offeredFeePaise);
}

/**
 * Usage Rights Surcharge calculation based on duration & ad rights.
 */
export function computeUsageSurcharge(
  fairFeePaise: number,
  usage?: UsageRightsInput
): number {
  if (!usage || !usage.type || usage.type === "none" || usage.type === "organic") {
    if (!usage?.paid_ads_allowed) {
      return 0;
    }
  }

  const type = usage.type.toLowerCase();
  const months = usage.months ?? null;
  const paidAdsAllowed = !!usage.paid_ads_allowed;

  if (type === "perpetual" || type === "unspecified") {
    return Math.round(fairFeePaise * RADAR_CONFIG.usageRates.perpetualOrUnspecified);
  }

  if (type === "paid_ads" || paidAdsAllowed) {
    if (months === null || months <= 3) {
      return Math.round(fairFeePaise * RADAR_CONFIG.usageRates.paidAdsMonths3);
    }
    if (months <= 6) {
      return Math.round(fairFeePaise * RADAR_CONFIG.usageRates.paidAdsMonths6);
    }
    if (months <= 12) {
      return Math.round(fairFeePaise * RADAR_CONFIG.usageRates.paidAdsMonths12);
    }
    return Math.round(fairFeePaise * RADAR_CONFIG.usageRates.perpetualOrUnspecified);
  }

  return 0;
}

/**
 * Payment Delay Financing Cost & Risk Premium calculation.
 * Baseline: 15 days. 18% annual financing. 2% risk premium per 30 days beyond 30 days.
 */
export function computePaymentDelayCost(
  offeredFeePaise: number,
  paymentDaysInput: number = 0
): { financingCostPaise: number; riskPremiumPaise: number; totalDelayCostPaise: number } {
  const days = Math.max(0, paymentDaysInput || 0);

  if (days <= RADAR_CONFIG.baselinePaymentDays) {
    return { financingCostPaise: 0, riskPremiumPaise: 0, totalDelayCostPaise: 0 };
  }

  const excessDays = days - RADAR_CONFIG.baselinePaymentDays;
  const financingCostPaise = Math.round(
    (offeredFeePaise * RADAR_CONFIG.annualFinancingRate * excessDays) / RADAR_CONFIG.daysInYear
  );

  let riskPremiumPaise = 0;
  if (days > RADAR_CONFIG.riskPremiumThresholdDays) {
    const blocks = Math.floor(
      (days - RADAR_CONFIG.riskPremiumThresholdDays) / RADAR_CONFIG.riskBlockSizeDays
    );
    riskPremiumPaise = Math.round(
      offeredFeePaise * RADAR_CONFIG.riskPremiumPerBlockPercent * blocks
    );
  }

  return {
    financingCostPaise,
    riskPremiumPaise,
    totalDelayCostPaise: financingCostPaise + riskPremiumPaise,
  };
}

/**
 * Exclusivity Leak Surcharge calculation.
 * Rate: 15% of fair fee per 30 days (prorated). Max 100% cap.
 */
export function computeExclusivityCost(
  fairFeePaise: number,
  exclusivityDaysInput: number = 0
): number {
  const days = Math.max(0, exclusivityDaysInput || 0);
  if (days === 0) return 0;

  const rawCost = Math.round(
    fairFeePaise * RADAR_CONFIG.exclusivityRatePer30Days * (days / 30)
  );
  const maxCap = Math.round(fairFeePaise * RADAR_CONFIG.maxExclusivityCapPercent);
  return Math.min(maxCap, rawCost);
}

/**
 * Brand History Delay Penalty calculation.
 * Rate: 18% annual interest on offered fee * past avg days late / 365.
 */
export function computeBrandHistoryPenalty(
  offeredFeePaise: number,
  avgDaysLateInput: number = 0
): number {
  const days = Math.max(0, avgDaysLateInput || 0);
  if (days === 0) return 0;

  return Math.round(
    (offeredFeePaise * RADAR_CONFIG.annualFinancingRate * days) / RADAR_CONFIG.daysInYear
  );
}

/**
 * Master Money Leak Radar calculation function.
 */
export function computeRadar(inputs: RadarInputs): RadarResult {
  const fairFeePaise = computeFairFee(inputs.deliverables, inputs.benchmarkMedians);
  const benchmarkGapPaise = computeBenchmarkGap(fairFeePaise, inputs.offeredFeePaise);
  const usageSurchargePaise = computeUsageSurcharge(fairFeePaise, inputs.usageRights);

  const { financingCostPaise, riskPremiumPaise, totalDelayCostPaise } =
    computePaymentDelayCost(inputs.offeredFeePaise, inputs.paymentDays ?? 0);

  const exclusivityCostPaise = computeExclusivityCost(
    fairFeePaise,
    inputs.exclusivityDays ?? 0
  );

  const historyPenaltyPaise = computeBrandHistoryPenalty(
    inputs.offeredFeePaise,
    inputs.avgDaysLate ?? 0
  );

  const totalAtRiskPaise =
    benchmarkGapPaise +
    usageSurchargePaise +
    totalDelayCostPaise +
    exclusivityCostPaise +
    historyPenaltyPaise;

  const breakdown = [
    {
      label: "Benchmark Fee Gap",
      paise: benchmarkGapPaise,
      formula: "max(0, Fair Market Benchmark - Brand Offer)",
      description: "Difference between market median deliverable rate and brand proposed fee.",
    },
    {
      label: "Commercial Usage Surcharge",
      paise: usageSurchargePaise,
      formula: "Fair Fee × Usage Tier %",
      description: "Royalty for brand paid ads, whitelisting, or perpetual digital usage rights.",
    },
    {
      label: "Payment Delay Financing Cost",
      paise: totalDelayCostPaise,
      formula: "(Offer × 18% × Days beyond 15 / 365) + Risk Premium",
      description: "Opportunity cost and financing interest borne for extended credit terms.",
    },
    {
      label: "Category Exclusivity Compensation",
      paise: exclusivityCostPaise,
      formula: "Fair Fee × 15% per 30 days (prorated)",
      description: "Opportunity cost of blocking partnerships with competing brands in your niche.",
    },
    {
      label: "Brand Delay Risk Surcharge",
      paise: historyPenaltyPaise,
      formula: "Offer × 18% × Avg Historical Days Late / 365",
      description: "Surcharge based on this brand's historical payment track record in your ledger.",
    },
  ];

  return {
    fairFeePaise,
    benchmarkGapPaise,
    usageSurchargePaise,
    financingCostPaise,
    riskPremiumPaise,
    totalDelayCostPaise,
    exclusivityCostPaise,
    historyPenaltyPaise,
    totalAtRiskPaise,
    breakdown,
  };
}

