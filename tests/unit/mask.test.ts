import { describe, it, expect } from "vitest";
import { tokenizePII, detokenizePII } from "../../lib/mask";

describe("PII Masking Engine", () => {
  it("masks Indian phone numbers, emails, and UPI IDs", () => {
    const raw =
      "Contact Diya at +91 9876543210 or diya.creator@gmail.com. Send advances to diya@okaxis. GST: 27AAAAA0000A1Z5";

    const { maskedText, tokenMap } = tokenizePII(raw);

    expect(maskedText).not.toContain("9876543210");
    expect(maskedText).not.toContain("diya.creator@gmail.com");
    expect(maskedText).not.toContain("diya@okaxis");
    expect(maskedText).not.toContain("27AAAAA0000A1Z5");

    expect(maskedText).toContain("[PHONE_1]");
    expect(maskedText).toContain("[EMAIL_1]");
    expect(maskedText).toContain("[UPI_1]");
    expect(maskedText).toContain("[GSTIN_1]");

    // Verify round-trip detokenization
    const restored = detokenizePII(maskedText, tokenMap);
    expect(restored).toBe(raw);
  });
});

