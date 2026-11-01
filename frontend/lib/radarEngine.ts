import {
  Deliverable,
  FollowerBand,
  Niche,
  RadarResult,
  UsageRightsDuration,
} from "../types/kreato";

// Benchmark rate lookup table (in integer paise)
export const BENCHMARK_RATES: Record<
  Niche,
  Record<FollowerBand, Record<string, number>>
> = {
  "Beauty & Skincare": {
    "10k-50k": { instagram_reel: 2500000, instagram_story: 800000, youtube_dedicated: 4500000 },
    "50k-100k": { instagram_reel: 4500000, instagram_story: 1500000, youtube_dedicated: 8500000 },
    "100k-250k": { instagram_reel: 8500000, instagram_story: 3000000, youtube_dedicated: 16000000 },
    "250k-500k": { instagram_reel: 15000000, instagram_story: 5000000, youtube_dedicated: 30000000 },
  },
  "Tech & Gadgets": {
    "10k-50k": { instagram_reel: 3000000, instagram_story: 1000000, youtube_dedicated: 6000000 },
    "50k-100k": { instagram_reel: 6000000, instagram_story: 2000000, youtube_dedicated: 12000000 },
    "100k-250k": { instagram_reel: 11000000, instagram_story: 3500000, youtube_dedicated: 22000000 },
    "250k-500k": { instagram_reel: 20000000, instagram_story: 6000000, youtube_dedicated: 40000000 },
  },
  "Fashion & Lifestyle": {
    "10k-50k": { instagram_reel: 2200000, instagram_story: 700000, youtube_dedicated: 4000000 },
    "50k-100k": { instagram_reel: 4000000, instagram_story: 1400000, youtube_dedicated: 7500000 },
    "100k-250k": { instagram_reel: 8000000, instagram_story: 2500000, youtube_dedicated: 15000000 },
    "250k-500k": { instagram_reel: 14000000, instagram_story: 4500000, youtube_dedicated: 28000000 },
  },
  "Fitness & Health": {
    "10k-50k": { instagram_reel: 2400000, instagram_story: 750000, youtube_dedicated: 4200000 },
    "50k-100k": { instagram_reel: 4200000, instagram_story: 1400000, youtube_dedicated: 8000000 },
    "100k-250k": { instagram_reel: 8200000, instagram_story: 2800000, youtube_dedicated: 15500000 },
    "250k-500k": { instagram_reel: 14500000, instagram_story: 4800000, youtube_dedicated: 29000000 },
  },
  Finance: {
    "10k-50k": { instagram_reel: 3500000, instagram_story: 1200000, youtube_dedicated: 7500000 },
    "50k-100k": { instagram_reel: 7000000, instagram_story: 2500000, youtube_dedicated: 15000000 },
    "100k-250k": { instagram_reel: 13000000, instagram_story: 4500000, youtube_dedicated: 28000000 },
    "250k-500k": { instagram_reel: 24000000, instagram_story: 8000000, youtube_dedicated: 50000000 },
  },
  "Food & Beverage": {
    "10k-50k": { instagram_reel: 2000000, instagram_story: 600000, youtube_dedicated: 3800000 },
    "50k-100k": { instagram_reel: 3800000, instagram_story: 1200000, youtube_dedicated: 7000000 },
    "100k-250k": { instagram_reel: 7500000, instagram_story: 2200000, youtube_dedicated: 14000000 },
    "250k-500k": { instagram_reel: 13000000, instagram_story: 4000000, youtube_dedicated: 25000000 },
  },
  Gaming: {
    "10k-50k": { instagram_reel: 2000000, instagram_story: 600000, youtube_dedicated: 4000000 },
    "50k-100k": { instagram_reel: 3800000, instagram_story: 1200000, youtube_dedicated: 7500000 },
    "100k-250k": { instagram_reel: 7500000, instagram_story: 2200000, youtube_dedicated: 15000000 },
    "250k-500k": { instagram_reel: 13500000, instagram_story: 4200000, youtube_dedicated: 27000000 },
  },
  Travel: {
    "10k-50k": { instagram_reel: 2500000, instagram_story: 800000, youtube_dedicated: 5000000 },
    "50k-100k": { instagram_reel: 4500000, instagram_story: 1500000, youtube_dedicated: 9000000 },
    "100k-250k": { instagram_reel: 8500000, instagram_story: 3000000, youtube_dedicated: 17000000 },
    "250k-500k": { instagram_reel: 15500000, instagram_story: 5500000, youtube_dedicated: 32000000 },
  },
  Education: {
    "10k-50k": { instagram_reel: 2200000, instagram_story: 700000, youtube_dedicated: 4500000 },
    "50k-100k": { instagram_reel: 4000000, instagram_story: 1300000, youtube_dedicated: 8500000 },
    "100k-250k": { instagram_reel: 8000000, instagram_story: 2600000, youtube_dedicated: 16000000 },
    "250k-500k": { instagram_reel: 14000000, instagram_story: 4800000, youtube_dedicated: 30000000 },
  },
};

export function calculateFairFee(
  niche: Niche,
  band: FollowerBand,
  deliverables: Deliverable[]
): number {
  const table = BENCHMARK_RATES[niche]?.[band] || BENCHMARK_RATES["Beauty & Skincare"]["50k-100k"];
  let totalPaise = 0;
  for (const item of deliverables) {
    const unitRate = table[item.format] || 3500000;
    totalPaise += unitRate * item.quantity;
  }
  return totalPaise;
}

export function computeMoneyLeakRadar(params: {
  niche: Niche;
  followerBand: FollowerBand;
  deliverables: Deliverable[];
  offeredFeePaise: number;
  usageRights: UsageRightsDuration;
  paymentTermsDays: number;
  exclusivityDays: number;
  avgBrandDaysLate?: number;
}): RadarResult {
  const fairFee = calculateFairFee(params.niche, params.followerBand, params.deliverables);
  const breakdown = [];

  // 1. Benchmark Gap
  const benchmarkGap = Math.max(0, fairFee - params.offeredFeePaise);
  if (benchmarkGap > 0) {
    breakdown.push({
      key: "benchmark_gap",
      label: "Underpriced Benchmark Gap",
      amountPaise: benchmarkGap,
      reason: `Brand offered ₹${(params.offeredFeePaise / 100).toLocaleString("en-IN")}, but market median for these deliverables is ₹${(fairFee / 100).toLocaleString("en-IN")}.`,
      formula: "max(0, Fair Fee - Offered Fee)",
      isSimulatedBenchmark: true,
    });
  }

  // 2. Usage Rights Leak Surcharge
  let usagePercent = 0;
  if (params.usageRights === "paid_ads_3m") usagePercent = 0.1;
  else if (params.usageRights === "paid_ads_6m") usagePercent = 0.2;
  else if (params.usageRights === "paid_ads_12m") usagePercent = 0.4;
  else if (params.usageRights === "perpetual") usagePercent = 1.0;

  const usageSurcharge = Math.round(fairFee * usagePercent);
  if (usageSurcharge > 0) {
    breakdown.push({
      key: "usage_rights_leak",
      label: "Uncompensated Usage Rights",
      amountPaise: usageSurcharge,
      reason: `Brand requested ${params.usageRights.replace(/_/g, " ")} without a licensing fee. Standard industry license surcharge is ${usagePercent * 100}% of fair fee.`,
      formula: `round(Fair Fee × ${usagePercent})`,
    });
  }

  // 3. Payment Delay Financing Cost & Risk Premium
  let paymentDelayCost = 0;
  if (params.paymentTermsDays > 15) {
    const delayDays = params.paymentTermsDays - 15;
    const financingCost = Math.round(params.offeredFeePaise * 0.18 * (delayDays / 365));
    let riskPremium = 0;
    if (params.paymentTermsDays > 30) {
      const blocks = Math.floor((params.paymentTermsDays - 30) / 30);
      riskPremium = Math.round(params.offeredFeePaise * 0.02 * blocks);
    }
    paymentDelayCost = financingCost + riskPremium;
    breakdown.push({
      key: "payment_delay_cost",
      label: "Payment Delay Financing Cost",
      amountPaise: paymentDelayCost,
      reason: `Payment term of net-${params.paymentTermsDays} days forces creator to finance brand credit at 18% annual capital rate + delay risk premium.`,
      formula: `round(Offered Fee × 0.18 × (${delayDays}/365)) + risk_premium`,
    });
  }

  // 4. Exclusivity Leak Surcharge
  let exclusivityCost = 0;
  if (params.exclusivityDays > 0) {
    const rawCost = Math.round(fairFee * 0.15 * (params.exclusivityDays / 30));
    exclusivityCost = Math.min(fairFee, rawCost);
    breakdown.push({
      key: "exclusivity_cost",
      label: "Category Exclusivity Lockout",
      amountPaise: exclusivityCost,
      reason: `${params.exclusivityDays} days of category exclusivity locks creator out of other brand collaborations in their niche without compensation.`,
      formula: `min(Fair Fee, round(Fair Fee × 0.15 × (${params.exclusivityDays}/30)))`,
    });
  }

  // 5. Brand History Penalty
  const avgLate = params.avgBrandDaysLate || 0;
  if (avgLate > 0) {
    const historyPenalty = Math.round(params.offeredFeePaise * 0.18 * (avgLate / 365));
    breakdown.push({
      key: "brand_history_penalty",
      label: "Brand Payment Track Record Penalty",
      amountPaise: historyPenalty,
      reason: `This brand averages ${avgLate} days late on previous payments based on your Personal Brand Ledger.`,
      formula: `round(Offered Fee × 0.18 × (${avgLate}/365))`,
    });
  }

  const totalAtRiskPaise = breakdown.reduce((sum, item) => sum + item.amountPaise, 0);

  let riskLevel: "low" | "medium" | "high" = "low";
  if (totalAtRiskPaise > 2500000) riskLevel = "high";
  else if (totalAtRiskPaise > 500000) riskLevel = "medium";

  return {
    totalAtRiskPaise,
    fairFeePaise: fairFee,
    breakdown,
    riskLevel,
  };
}

