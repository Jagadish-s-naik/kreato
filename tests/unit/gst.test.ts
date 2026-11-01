import { describe, it, expect } from "vitest";
import { generateInvoiceNumber, calculateGST } from "../../lib/gst";

describe("GST & Sequential Invoicing Engine", () => {
  it("generates sequential invoice numbers with FY label", () => {
    expect(generateInvoiceNumber(0, "2026-27")).toBe("DS/2026-27/001");
    expect(generateInvoiceNumber(1, "2026-27")).toBe("DS/2026-27/002");
    expect(generateInvoiceNumber(42, "2026-27")).toBe("DS/2026-27/043");
  });

  it("calculates Intra-state GST (CGST 9% + SGST 9%)", () => {
    // ₹10,000 (1,000,000 paise) within Maharashtra
    const gst = calculateGST(1000000, "Maharashtra", "Maharashtra");
    expect(gst.isInterState).toBe(false);
    expect(gst.cgstPaise).toBe(90000); // ₹900
    expect(gst.sgstPaise).toBe(90000); // ₹900
    expect(gst.igstPaise).toBe(0);
    expect(gst.totalTaxPaise).toBe(180000); // ₹1,800
    expect(gst.grandTotalPaise).toBe(1180000); // ₹11,800
  });

  it("calculates Inter-state GST (IGST 18%)", () => {
    // ₹10,000 (1,000,000 paise) Maharashtra to Delhi
    const gst = calculateGST(1000000, "Maharashtra", "Delhi");
    expect(gst.isInterState).toBe(true);
    expect(gst.cgstPaise).toBe(0);
    expect(gst.sgstPaise).toBe(0);
    expect(gst.igstPaise).toBe(180000); // ₹1,800
    expect(gst.totalTaxPaise).toBe(180000);
    expect(gst.grandTotalPaise).toBe(1180000);
  });
});

