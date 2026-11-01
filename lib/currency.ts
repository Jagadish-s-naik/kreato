/**
 * Indian Rupee & Integer Paise Currency Utilities
 * 1 INR = 100 paise
 */

/**
 * Formats integer paise into standard Indian Rupee notation (en-IN).
 * E.g. 2500000 paise -> "₹25,000"
 * E.g. 105479 paise (with decimals) -> "₹1,054.79"
 */
export function formatPaiseToINR(
  paise: number,
  options: { showPaise?: boolean; showSymbol?: boolean } = {}
): string {
  const { showPaise = false, showSymbol = true } = options;
  const rupees = paise / 100;

  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: showPaise ? 2 : 0,
    maximumFractionDigits: showPaise ? 2 : 0,
  }).format(rupees);

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Formats paise with two decimal places if non-zero fractional rupees exist.
 * E.g. 105479 -> "₹1,054.79", 2000000 -> "₹20,000"
 */
export function formatPaiseAdaptive(paise: number): string {
  const hasDecimals = paise % 100 !== 0;
  return formatPaiseToINR(paise, { showPaise: hasDecimals });
}

/**
 * Parses Indian currency notation, shorthand strings, and messy user text into integer paise.
 * Examples:
 * - "30k" -> 3,000,000 paise (₹30,000)
 * - "1.5L" / "1.5 Lakh" -> 15,000,000 paise (₹1,50,000)
 * - "₹25,000/-" -> 2,500,000 paise (₹25,000)
 * - "25000" -> 2,500,000 paise (₹25,000)
 * - 25000 (number) -> 2,500,000 paise
 */
export function parseIndianAmountToPaise(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined) return null;

  if (typeof input === "number") {
    if (isNaN(input) || input < 0) return null;
    return Math.round(input * 100);
  }

  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[₹,/\-\s]/g, "");

  if (!cleaned) return null;

  // Handle 'k' / 'thousand' (e.g. 30k, 25.5k)
  const kMatch = cleaned.match(/^([0-9.]+)(k|thousand)$/);
  if (kMatch) {
    const val = parseFloat(kMatch[1]);
    if (isNaN(val)) return null;
    return Math.round(val * 1000 * 100);
  }

  // Handle 'l' / 'lakh' / 'lac' (e.g. 1.5l, 2lakh)
  const lakhMatch = cleaned.match(/^([0-9.]+)(l|lakh|lac|lacs|lakhs)$/);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]);
    if (isNaN(val)) return null;
    return Math.round(val * 100000 * 100);
  }

  // Handle 'cr' / 'crore' (e.g. 1cr)
  const crMatch = cleaned.match(/^([0-9.]+)(cr|crore|crores)$/);
  if (crMatch) {
    const val = parseFloat(crMatch[1]);
    if (isNaN(val)) return null;
    return Math.round(val * 10000000 * 100);
  }

  // Handle plain numbers (e.g. 25000, 25000.50)
  const num = parseFloat(cleaned);
  if (isNaN(num) || num < 0) return null;

  return Math.round(num * 100);
}

