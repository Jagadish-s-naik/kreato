import { describe, it, expect } from "vitest";
import { slugifyBrandName, calculateAverageDaysLate } from "../../lib/ledger";

describe("Personal Brand Ledger Utilities", () => {
  it("normalizes diverse brand names into consistent brand keys", () => {
    expect(slugifyBrandName("Plum Goodness")).toBe("plum_goodness");
    expect(slugifyBrandName("boAt Lifestyle")).toBe("boat_lifestyle");
    expect(slugifyBrandName("Mamaearth - Honasa")).toBe("mamaearth_honasa");
    expect(slugifyBrandName("Nykaa Fashion / Beauty")).toBe("nykaa_fashion_beauty");
    expect(slugifyBrandName("  Sugar Cosmetics  ")).toBe("sugar_cosmetics");
  });

  it("calculates average historical delay and payment breakdown", () => {
    const stats = calculateAverageDaysLate([
      { promisedDays: 15, actualDays: 15, amountPaise: 2000000 },
      { promisedDays: 15, actualDays: 45, amountPaise: 2500000 }, // 30 days late
      { promisedDays: 30, actualDays: 40, amountPaise: 1500000 }, // 10 days late
    ]);

    // Total late = 40 days across 3 payments => avg ~13 days late
    expect(stats.avgDaysLate).toBe(13);
    expect(stats.totalDaysLate).toBe(40);
    expect(stats.onTimeCount).toBe(1);
    expect(stats.lateCount).toBe(2);
  });
});

