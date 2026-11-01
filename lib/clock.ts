/**
 * Virtual time-travel clock offset calculator for demo & simulation testing.
 */
export function getEffectiveDate(simDaysOffset: number = 0): Date {
  const now = new Date();
  if (!simDaysOffset || isNaN(simDaysOffset)) {
    return now;
  }
  return new Date(now.getTime() + simDaysOffset * 86400000);
}

