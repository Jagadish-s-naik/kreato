export interface GstCalculationResult {
  taxableAmountPaise: number;
  isGstRegistered: boolean;
  isInterState: boolean;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalTaxPaise: number;
  totalAmountPaise: number;
  sacCode: string;
}

export function calculateGst(params: {
  taxableAmountPaise: number;
  hasGstin: boolean;
  supplierState: string;
  clientState: string;
}): GstCalculationResult {
  const sacCode = "998365"; // Default Indian SAC code for online promotional/creator services

  if (!params.hasGstin) {
    return {
      taxableAmountPaise: params.taxableAmountPaise,
      isGstRegistered: false,
      isInterState: false,
      cgstPaise: 0,
      sgstPaise: 0,
      igstPaise: 0,
      totalTaxPaise: 0,
      totalAmountPaise: params.taxableAmountPaise,
      sacCode,
    };
  }

  const isInterState =
    params.supplierState.trim().toLowerCase() !==
    params.clientState.trim().toLowerCase();

  let cgstPaise = 0;
  let sgstPaise = 0;
  let igstPaise = 0;

  if (isInterState) {
    // 18% IGST
    igstPaise = Math.round(params.taxableAmountPaise * 0.18);
  } else {
    // 9% CGST + 9% SGST
    cgstPaise = Math.round(params.taxableAmountPaise * 0.09);
    sgstPaise = Math.round(params.taxableAmountPaise * 0.09);
  }

  const totalTaxPaise = cgstPaise + sgstPaise + igstPaise;
  const totalAmountPaise = params.taxableAmountPaise + totalTaxPaise;

  return {
    taxableAmountPaise: params.taxableAmountPaise,
    isGstRegistered: true,
    isInterState,
    cgstPaise,
    sgstPaise,
    igstPaise,
    totalTaxPaise,
    totalAmountPaise,
    sacCode,
  };
}

export function generateUpiUri(params: {
  upiVpa: string;
  creatorName: string;
  amountPaise: number;
  invoiceNumber: string;
}): string {
  const amountRupees = (params.amountPaise / 100).toFixed(2);
  const encodedName = encodeURIComponent(params.creatorName);
  const note = encodeURIComponent(`Invoice ${params.invoiceNumber}`);
  return `upi://pay?pa=${params.upiVpa}&pn=${encodedName}&am=${amountRupees}&cu=INR&tn=${note}`;
}

