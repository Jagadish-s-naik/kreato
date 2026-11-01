/**
 * Brand Key Normalization & Personal Brand Ledger Calculations
 */

/**
 * Converts any messy brand name into a standardized brand key for aggregation.
 * E.g. "Plum Goodness" -> "plum_goodness", "boAt Lifestyle" -> "boat_lifestyle"
 */
export function slugifyBrandName(name: string): string {
  return (name || "unknown")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export interface PaymentDelayRecord {
  promisedDays: number;
  actualDays: number;
  amountPaise: number;
}

export function calculateAverageDaysLate(payments: PaymentDelayRecord[]): {
  avgDaysLate: number;
  totalDaysLate: number;
  onTimeCount: number;
  lateCount: number;
} {
  if (!payments || payments.length === 0) {
    return { avgDaysLate: 0, totalDaysLate: 0, onTimeCount: 0, lateCount: 0 };
  }

  let totalDaysLate = 0;
  let onTimeCount = 0;
  let lateCount = 0;

  for (const p of payments) {
    const daysLate = Math.max(0, p.actualDays - p.promisedDays);
    totalDaysLate += daysLate;
    if (daysLate > 0) {
      lateCount++;
    } else {
      onTimeCount++;
    }
  }

  const avgDaysLate = Math.round(totalDaysLate / payments.length);
  return { avgDaysLate, totalDaysLate, onTimeCount, lateCount };
}

