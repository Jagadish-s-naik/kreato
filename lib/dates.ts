/**
 * Indian Calendar & Financial Year (FY) Date Utilities
 */

export interface FinancialYearInfo {
  startYear: number;
  endYear: number;
  label: string; // e.g. "2026-27"
}

/**
 * Calculates Indian Financial Year (April 1 to March 31).
 * E.g.
 * - Nov 2026 -> FY 2026-27
 * - Feb 2027 -> FY 2026-27
 * - Apr 2027 -> FY 2027-28
 */
export function calculateIndianFinancialYear(dateInput: Date | string = new Date()): FinancialYearInfo {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-indexed: 0 = Jan, 3 = Apr

  let startYear: number;
  let endYear: number;

  if (month >= 3) {
    // April through December
    startYear = year;
    endYear = year + 1;
  } else {
    // January through March
    startYear = year - 1;
    endYear = year;
  }

  const endShort = String(endYear).slice(-2);
  return {
    startYear,
    endYear,
    label: `${startYear}-${endShort}`,
  };
}

/**
 * Adds credit terms (in days) to an issue date to calculate invoice due date.
 */
export function calculateDueDate(issueDateInput: Date | string, paymentDays: number): Date {
  const issue = typeof issueDateInput === "string" ? new Date(issueDateInput) : new Date(issueDateInput.getTime());
  const due = new Date(issue.getTime() + Math.max(0, paymentDays) * 86400000);
  return due;
}

/**
 * Calculates how many days an invoice is overdue relative to effective date.
 * Returns 0 if not overdue.
 */
export function calculateDaysOverdue(dueDateInput: Date | string, effectiveDate: Date = new Date()): number {
  const due = typeof dueDateInput === "string" ? new Date(dueDateInput) : dueDateInput;
  const diffTime = effectiveDate.getTime() - due.getTime();
  if (diffTime <= 0) return 0;
  return Math.floor(diffTime / 86400000);
}

/**
 * Formats date into standard Indian format DD/MM/YYYY
 */
export function formatISTDate(dateInput: Date | string): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

