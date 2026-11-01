import { describe, it, expect } from "vitest";
import { getEffectiveDate } from "../../lib/clock";
import { calculateDaysOverdue } from "../../lib/dates";

describe("Clock Simulator & Time-Travel Engine", () => {
  it("advances virtual date by exact sim_days_offset days", () => {
    const baseline = new Date();
    const advanced30 = getEffectiveDate(30);

    const diffMs = advanced30.getTime() - baseline.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    expect(diffDays).toBe(30);
  });

  it("handles negative offset for retroactive simulation", () => {
    const baseline = new Date();
    const past15 = getEffectiveDate(-15);

    const diffMs = baseline.getTime() - past15.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    expect(diffDays).toBe(15);
  });

  it("correctly flags an invoice as overdue after advancing 30 days", () => {
    // Invoice due in 15 days from now
    const now = new Date();
    const dueDate = new Date(now.getTime() + 15 * 86400000);

    // Right now: 0 days overdue
    expect(calculateDaysOverdue(dueDate, now)).toBe(0);

    // Advance 30 days: now effective date is +30 days, which is 15 days past due date
    const effectiveDate = getEffectiveDate(30);
    const overdueDays = calculateDaysOverdue(dueDate, effectiveDate);
    expect(overdueDays).toBe(15);
  });
});

