import { describe, it, expect } from "vitest";
import {
  computeFairFee,
  computeBenchmarkGap,
  computeUsageSurcharge,
  computePaymentDelayCost,
  computeExclusivityCost,
  computeBrandHistoryPenalty,
  computeRadar,
} from "../../lib/radar";

describe("Money Leak Radar Engine — Golden Verification", () => {
  /**
   * Golden Example 1: Standard Underpriced Skincare Deal
   * Reference: docs/RADAR_SPEC.md Section 3.1
   */
  describe("Golden Example 1: Underpriced Skincare Deal", () => {
    const benchmarkMedians = {
      reel: 3000000, // ₹30,000 (3,000,000 paise)
      story: 750000, // ₹7,500 (750,000 paise)
    };

    const deliverables = [
      { format: "reel", quantity: 1 },
      { format: "story", quantity: 2 },
    ];

    const offeredFeePaise = 2500000; // ₹25,000

    it("calculates Fair Fee = 4,500,000 paise (₹45,000)", () => {
      const fairFee = computeFairFee(deliverables, benchmarkMedians);
      expect(fairFee).toBe(4500000);
    });

    it("calculates Benchmark Gap = 2,000,000 paise (₹20,000)", () => {
      const gap = computeBenchmarkGap(4500000, offeredFeePaise);
      expect(gap).toBe(2000000);
    });

    it("calculates Usage Surcharge = 900,000 paise (₹9,000) for 6 months paid ads (20%)", () => {
      const usage = computeUsageSurcharge(4500000, {
        type: "paid_ads",
        months: 6,
        paid_ads_allowed: true,
      });
      expect(usage).toBe(900000);
    });

    it("calculates Payment Delay Cost for 60 days = 105,479 paise (₹1,054.79)", () => {
      const delay = computePaymentDelayCost(offeredFeePaise, 60);
      expect(delay.financingCostPaise).toBe(55479);
      expect(delay.riskPremiumPaise).toBe(50000);
      expect(delay.totalDelayCostPaise).toBe(105479);
    });

    it("calculates Exclusivity Surcharge for 60 days = 1,350,000 paise (₹13,500)", () => {
      const exclusivity = computeExclusivityCost(4500000, 60);
      expect(exclusivity).toBe(1350000);
    });

    it("calculates Brand History Penalty for 47 days late = 57,945 paise (₹579.45)", () => {
      const penalty = computeBrandHistoryPenalty(offeredFeePaise, 47);
      expect(penalty).toBe(57945);
    });

    it("computes Total ₹ at Risk = 4,413,424 paise (₹44,134.24)", () => {
      const result = computeRadar({
        deliverables,
        benchmarkMedians,
        offeredFeePaise,
        usageRights: { type: "paid_ads", months: 6, paid_ads_allowed: true },
        paymentDays: 60,
        exclusivityDays: 60,
        avgDaysLate: 47,
      });

      expect(result.fairFeePaise).toBe(4500000);
      expect(result.benchmarkGapPaise).toBe(2000000);
      expect(result.usageSurchargePaise).toBe(900000);
      expect(result.totalDelayCostPaise).toBe(105479);
      expect(result.exclusivityCostPaise).toBe(1350000);
      expect(result.historyPenaltyPaise).toBe(57945);
      expect(result.totalAtRiskPaise).toBe(4413424);
    });
  });

  /**
   * Golden Example 2: Perpetual Usage & High Payment Delay (Clean Brand)
   * Reference: docs/RADAR_SPEC.md Section 3.2
   */
  describe("Golden Example 2: Perpetual Usage & High Delay", () => {
    const benchmarkMedians = {
      youtube_video: 2000000, // ₹20,000 (2,000,000 paise)
    };

    const deliverables = [{ format: "youtube_video", quantity: 1 }];
    const offeredFeePaise = 1500000; // ₹15,000

    it("computes Total ₹ at Risk = 2,615,479 paise (₹26,154.79)", () => {
      const result = computeRadar({
        deliverables,
        benchmarkMedians,
        offeredFeePaise,
        usageRights: { type: "perpetual" },
        paymentDays: 90,
        exclusivityDays: 0,
        avgDaysLate: 0,
      });

      expect(result.fairFeePaise).toBe(2000000);
      expect(result.benchmarkGapPaise).toBe(500000);
      expect(result.usageSurchargePaise).toBe(2000000);
      expect(result.financingCostPaise).toBe(55479);
      expect(result.riskPremiumPaise).toBe(60000);
      expect(result.totalDelayCostPaise).toBe(115479);
      expect(result.exclusivityCostPaise).toBe(0);
      expect(result.historyPenaltyPaise).toBe(0);
      expect(result.totalAtRiskPaise).toBe(2615479);
    });
  });
});

