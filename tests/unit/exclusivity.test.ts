import { describe, it, expect } from "vitest";
import { checkExclusivityConflict } from "../../lib/exclusivity";

describe("Exclusivity Conflict Engine", () => {
  const activeCampaigns = [
    {
      id: "camp-1",
      brandName: "Mamaearth",
      category: "skincare",
      startDate: "2026-11-01",
      endDate: "2026-11-30",
    },
    {
      id: "camp-2",
      brandName: "boAt",
      category: "tech_gadgets",
      startDate: "2026-11-15",
      endDate: "2026-12-15",
    },
  ];

  it("detects direct category conflict with overlapping dates", () => {
    const result = checkExclusivityConflict({
      proposedCategory: "skincare",
      proposedStartDate: "2026-11-20",
      proposedEndDate: "2026-12-10",
      activeCampaigns,
    });

    expect(result.hasConflict).toBe(true);
    expect(result.conflictingCampaigns).toHaveLength(1);
    expect(result.conflictingCampaigns[0].brandName).toBe("Mamaearth");
    expect(result.conflictingCampaigns[0].overlapDays).toBe(11); // Nov 20 to Nov 30
  });

  it("permits deals in non-conflicting categories during overlapping dates", () => {
    const result = checkExclusivityConflict({
      proposedCategory: "food_beverage",
      proposedStartDate: "2026-11-20",
      proposedEndDate: "2026-12-10",
      activeCampaigns,
    });

    expect(result.hasConflict).toBe(false);
    expect(result.conflictingCampaigns).toHaveLength(0);
  });
});

