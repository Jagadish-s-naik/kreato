import { describe, it, expect } from "vitest";
import { computeLadder } from "../../lib/ladder";
import { RadarResult } from "../../lib/radar";

describe("Walk-away Ladder Matrix Engine", () => {
  const sampleRadar: RadarResult = {
    fairFeePaise: 4500000, // ₹45,000
    benchmarkGapPaise: 2000000,
    usageSurchargePaise: 900000, // ₹9,000
    financingCostPaise: 55479,
    riskPremiumPaise: 50000,
    totalDelayCostPaise: 105479,
    exclusivityCostPaise: 1350000, // ₹13,500
    historyPenaltyPaise: 57945,
    totalAtRiskPaise: 4413424,
    breakdown: [],
  };

  it("computes Ideal Tier (Fair Fee + 100% Usage + 100% Exclusivity)", () => {
    const ladder = computeLadder(sampleRadar, 3000000);
    // 4,500,000 + 900,000 + 1,350,000 = 6,750,000 paise (₹67,500)
    expect(ladder.ideal.feePaise).toBe(6750000);
    expect(ladder.ideal.paymentDays).toBe(15);
    expect(ladder.ideal.advancePercent).toBe(50);
  });

  it("computes Acceptable Tier (Fair Fee + 50% Surcharges)", () => {
    const ladder = computeLadder(sampleRadar, 3000000);
    // 4,500,000 + (900,000 + 1,350,000) * 0.5 = 4,500,000 + 1,125,000 = 5,625,000 paise (₹56,250)
    expect(ladder.acceptable.feePaise).toBe(5625000);
    expect(ladder.acceptable.paymentDays).toBe(30);
  });

  it("computes Walkaway Floor respecting creator minimum fee", () => {
    // 80% of 4,500,000 = 3,600,000 paise
    // If min fee is 4,000,000, walkaway must be 4,000,000
    const ladder = computeLadder(sampleRadar, 4000000);
    expect(ladder.walkaway.feePaise).toBe(4000000);
    expect(ladder.walkaway.paymentDays).toBe(45);
  });
});

