/**
 * UPI URI & QR Code Payment Generator
 * Reference: NPCI UPI Linking Specifications
 */

export interface UPIPaymentParams {
  vpa: string; // e.g. "creator@okaxis"
  payeeName: string; // e.g. "Diya Sharma"
  amountPaise: number; // e.g. 2500000
  note?: string; // e.g. "Invoice DS/2026-27/001"
  transactionRef?: string; // e.g. "DS-001"
}

/**
 * Builds standard upi://pay URI string.
 * Example:
 * upi://pay?pa=creator@okaxis&pn=Diya%20Sharma&am=25000.00&cu=INR&tn=Invoice%20DS%2F2026-27%2F001
 */
export function buildUPIPaymentURI(params: UPIPaymentParams): string {
  const { vpa, payeeName, amountPaise, note, transactionRef } = params;

  if (!vpa || !vpa.includes("@")) {
    throw new Error("Invalid UPI VPA address.");
  }

  const amountRupees = (amountPaise / 100).toFixed(2);

  const queryParams = new URLSearchParams({
    pa: vpa.trim(),
    pn: payeeName.trim(),
    am: amountRupees,
    cu: "INR",
  });

  if (note) {
    queryParams.set("tn", note.trim());
  }

  if (transactionRef) {
    queryParams.set("tr", transactionRef.trim());
  }

  return `upi://pay?${queryParams.toString()}`;
}

