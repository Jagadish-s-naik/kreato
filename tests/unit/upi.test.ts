import { describe, it, expect } from "vitest";
import { buildUPIPaymentURI } from "../../lib/upi";

describe("UPI Payment URI Builder", () => {
  it("builds valid upi://pay URI with standard parameters", () => {
    const uri = buildUPIPaymentURI({
      vpa: "creator@okaxis",
      payeeName: "Diya Sharma",
      amountPaise: 2500000, // ₹25,000
      note: "Invoice DS/2026-27/001",
    });

    expect(uri).toContain("upi://pay?");
    expect(uri).toContain("pa=creator%40okaxis");
    expect(uri).toContain("pn=Diya+Sharma");
    expect(uri).toContain("am=25000.00");
    expect(uri).toContain("cu=INR");
    expect(uri).toContain("tn=Invoice+DS%2F2026-27%2F001");
  });

  it("throws error for invalid VPA without @ symbol", () => {
    expect(() =>
      buildUPIPaymentURI({
        vpa: "invalidvpa",
        payeeName: "Diya Sharma",
        amountPaise: 100000,
      })
    ).toThrow("Invalid UPI VPA address.");
  });
});

