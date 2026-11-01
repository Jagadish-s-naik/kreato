import { RadarResult } from "./radar";

export interface LadderTier {
  feePaise: number;
  paymentDays: number;
  advancePercent: number;
  usageRightsSummary: string;
  exclusivitySummary: string;
  termsSummary: string;
}

export interface LadderTiers {
  ideal: LadderTier;
  acceptable: LadderTier;
  walkaway: LadderTier;
}

export function computeLadder(
  radar: RadarResult,
  creatorMinFeePaise: number = 0
): LadderTiers {
  const { fairFeePaise, usageSurchargePaise, exclusivityCostPaise } = radar;

  // 1. Ideal Tier: Full Fair Fee + 100% Usage + 100% Exclusivity
  const idealFeePaise = fairFeePaise + usageSurchargePaise + exclusivityCostPaise;
  const ideal: LadderTier = {
    feePaise: idealFeePaise,
    paymentDays: 15,
    advancePercent: 50,
    usageRightsSummary: "Strictly capped duration; no perpetual rights",
    exclusivitySummary: "Compensated at fair market rate or waived",
    termsSummary: "50% advance, balance within 15 days of live post",
  };

  // 2. Acceptable Tier: Fair Fee + 50% of Surcharges
  const acceptableFeePaise = Math.round(
    fairFeePaise + (usageSurchargePaise + exclusivityCostPaise) * 0.5
  );
  const acceptable: LadderTier = {
    feePaise: acceptableFeePaise,
    paymentDays: 30,
    advancePercent: 0,
    usageRightsSummary: "Max 3 months digital usage / paid ads",
    exclusivitySummary: "Max 30 days category exclusivity",
    termsSummary: "Net-30 payment cycle; strictly 3 months usage",
  };

  // 3. Walk-away Floor: 80% of Fair Fee or creator floor
  const standardFloorPaise = Math.round(fairFeePaise * 0.8);
  const walkawayFeePaise = Math.max(creatorMinFeePaise || 0, standardFloorPaise);
  const walkaway: LadderTier = {
    feePaise: walkawayFeePaise,
    paymentDays: 45,
    advancePercent: 0,
    usageRightsSummary: "Organic repost only (NO whitelisting or ad rights)",
    exclusivitySummary: "Zero category exclusivity (creator free to collab)",
    termsSummary: "Absolute bottom line: organic post only, max net-45",
  };

  return { ideal, acceptable, walkaway };
}

