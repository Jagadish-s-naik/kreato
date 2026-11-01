/**
 * GST Calculation & Sequential Financial Year Invoice Number Generator
 */

export interface GSTCalculationResult {
  taxablePaise: number;
  isInterState: boolean;
  cgstPaise: number; // 9%
  sgstPaise: number; // 9%
  igstPaise: number; // 18%
  totalTaxPaise: number;
  grandTotalPaise: number;
  ratePercent: number; // 18%
}

/**
 * Generates sequential FY invoice number, e.g. "DS/2026-27/001"
 */
export function generateInvoiceNumber(
  lastNumber: number = 0,
  fyLabel: string = "2026-27",
  prefix: string = "DS"
): string {
  const nextNum = (lastNumber || 0) + 1;
  const padded = String(nextNum).padStart(3, "0");
  return `${prefix}/${fyLabel}/${padded}`;
}

/**
 * Computes GST breakdown:
 * - Intra-state (same state): 9% CGST + 9% SGST
 * - Inter-state (different states): 18% IGST
 */
export function calculateGST(
  taxablePaise: number,
  supplierState: string,
  clientState: string
): GSTCalculationResult {
  const cleanSupplier = (supplierState || "").trim().toLowerCase();
  const cleanClient = (clientState || "").trim().toLowerCase();

  const isInterState = cleanSupplier !== cleanClient;

  let cgstPaise = 0;
  let sgstPaise = 0;
  let igstPaise = 0;

  if (isInterState) {
    igstPaise = Math.round(taxablePaise * 0.18);
  } else {
    cgstPaise = Math.round(taxablePaise * 0.09);
    sgstPaise = Math.round(taxablePaise * 0.09);
  }

  const totalTaxPaise = isInterState ? igstPaise : cgstPaise + sgstPaise;
  const grandTotalPaise = taxablePaise + totalTaxPaise;

  return {
    taxablePaise,
    isInterState,
    cgstPaise,
    sgstPaise,
    igstPaise,
    totalTaxPaise,
    grandTotalPaise,
    ratePercent: 18,
  };
}

