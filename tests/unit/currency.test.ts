import { describe, it, expect } from "vitest";
import {
  formatPaiseToINR,
  formatPaiseAdaptive,
  parseIndianAmountToPaise,
} from "../../lib/currency";

describe("Currency Utilities — Integer Paise & Formatting", () => {
  it("formats integer paise to INR string", () => {
    expect(formatPaiseToINR(2500000)).toBe("₹25,000");
    expect(formatPaiseToINR(4500000)).toBe("₹45,000");
    expect(formatPaiseToINR(105479, { showPaise: true })).toBe("₹1,054.79");
  });

  it("formats paise adaptively based on non-zero fractions", () => {
    expect(formatPaiseAdaptive(2500000)).toBe("₹25,000");
    expect(formatPaiseAdaptive(105479)).toBe("₹1,054.79");
  });

  it("parses Indian currency shorthand strings correctly", () => {
    expect(parseIndianAmountToPaise("30k")).toBe(3000000);
    expect(parseIndianAmountToPaise("25.5k")).toBe(2550000);
    expect(parseIndianAmountToPaise("1.5L")).toBe(15000000);
    expect(parseIndianAmountToPaise("2 Lakh")).toBe(20000000);
    expect(parseIndianAmountToPaise("₹25,000/-")).toBe(2500000);
    expect(parseIndianAmountToPaise("15000")).toBe(1500000);
    expect(parseIndianAmountToPaise(50000)).toBe(5000000);
    expect(parseIndianAmountToPaise("invalid")).toBeNull();
    expect(parseIndianAmountToPaise(null)).toBeNull();
  });
});

