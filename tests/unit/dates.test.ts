import { describe, it, expect } from "vitest";
import {
  calculateIndianFinancialYear,
  calculateDueDate,
  calculateDaysOverdue,
} from "../../lib/dates";

describe("Dates & Indian Financial Year Utilities", () => {
  it("calculates correct Indian Financial Year (April - March)", () => {
    // November 2026 -> FY 2026-27
    expect(calculateIndianFinancialYear(new Date("2026-11-01"))).toEqual({
      startYear: 2026,
      endYear: 2027,
      label: "2026-27",
    });

    // February 2027 -> FY 2026-27
    expect(calculateIndianFinancialYear(new Date("2027-02-15"))).toEqual({
      startYear: 2026,
      endYear: 2027,
      label: "2026-27",
    });

    // April 2027 -> FY 2027-28
    expect(calculateIndianFinancialYear(new Date("2027-04-01"))).toEqual({
      startYear: 2027,
      endYear: 2028,
      label: "2027-28",
    });
  });

  it("calculates due dates based on payment terms in days", () => {
    const issueDate = new Date("2026-11-01T00:00:00.000Z");
    const dueDate = calculateDueDate(issueDate, 30);
    // 30 days from Nov 1 is Dec 1
    expect(dueDate.getUTCDate()).toBe(1);
    expect(dueDate.getUTCMonth()).toBe(11); // December (0-indexed 11)
  });

  it("calculates days overdue relative to effective date", () => {
    const dueDate = new Date("2026-11-01");
    const effectiveDate = new Date("2026-11-15");
    expect(calculateDaysOverdue(dueDate, effectiveDate)).toBe(14);
  });
});

