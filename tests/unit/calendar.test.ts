import { describe, it, expect } from "vitest";
import {
  escapeICSText,
  foldLine,
  addDaysToDateString,
  toICSDate,
  buildGoogleCalendarLink,
  generateDealCalendarICS,
  CalendarDealData,
} from "@/lib/calendar/ics";

describe("Calendar Module (Feature 12)", () => {
  describe("escapeICSText", () => {
    it("escapes backslashes, semicolons, commas, and newlines", () => {
      const input = "Hello, world; this is \\ backslash \n and newline\r\nand CRLF";
      const escaped = escapeICSText(input);
      expect(escaped).toBe("Hello\\, world\\; this is \\\\ backslash \\n and newline\\nand CRLF");
    });
  });

  describe("foldLine UTF-8 safe 75-octet line folding", () => {
    it("does not fold lines shorter than or equal to 75 octets", () => {
      const line = "SUMMARY:Short event name";
      expect(foldLine(line)).toBe(line);
    });

    it("folds long ASCII lines safely at 75 octets with CRLF and space indentation", () => {
      const longLine = "DESCRIPTION:" + "A".repeat(100);
      const folded = foldLine(longLine);
      const lines = folded.split("\r\n");

      expect(lines.length).toBeGreaterThan(1);
      const encoder = new TextEncoder();
      for (const l of lines) {
        expect(encoder.encode(l).length).toBeLessThanOrEqual(75);
      }
      expect(lines[1].startsWith(" ")).toBe(true);
    });

    it("preserves multi-byte UTF-8 characters (Hindi Devanagari & ₹ symbol) without byte cutting", () => {
      const hindiAndRupee = "SUMMARY:सौदे का मूल्य ₹50,000 है और इसमें बहुत सारे विवरण शामिल हैं और अधिक लंबा पाठ";
      const folded = foldLine(hindiAndRupee);
      const lines = folded.split("\r\n");

      const encoder = new TextEncoder();
      const decoder = new TextDecoder("utf-8", { fatal: true });

      for (const l of lines) {
        const bytes = encoder.encode(l);
        expect(bytes.length).toBeLessThanOrEqual(75);
        // Ensure every line decodes as valid UTF-8 without throwing
        expect(() => decoder.decode(bytes)).not.toThrow();
      }

      // Reassembling should reconstruct the exact text
      const reassembled = lines.map((l, idx) => (idx === 0 ? l : l.slice(1))).join("");
      expect(reassembled).toBe(hindiAndRupee);
    });
  });

  describe("addDaysToDateString & leap day handling", () => {
    it("handles standard month boundary correctly", () => {
      expect(addDaysToDateString("2026-11-25", 1)).toBe("2026-11-26");
      expect(addDaysToDateString("2026-11-30", 1)).toBe("2026-12-01");
    });

    it("correctly handles leap year 2028-02-29 and transitions", () => {
      expect(addDaysToDateString("2028-02-28", 1)).toBe("2028-02-29");
      expect(addDaysToDateString("2028-02-28", 2)).toBe("2028-03-01");
      expect(addDaysToDateString("2028-02-29", 1)).toBe("2028-03-01");
    });

    it("correctly computes exclusivity window with exclusive DTEND", () => {
      // 60-day exclusivity starting Nov 25, 2026:
      // Day 1: Nov 25. Day 60: Jan 23, 2027.
      // Exclusive DTEND (start + 60 + 1 days): Jan 25, 2027
      const exclusiveEnd = addDaysToDateString("2026-11-25", 60 + 1);
      expect(exclusiveEnd).toBe("2027-01-25");
      expect(toICSDate(exclusiveEnd)).toBe("20270125");
    });
  });

  describe("buildGoogleCalendarLink", () => {
    it("generates a zero-OAuth Google Calendar render URL with URL-encoded parameters", () => {
      const link = buildGoogleCalendarLink({
        title: "Delivery: GlowSkin - 1 Reel",
        startDate: "2026-11-25",
        endDate: "2026-11-26",
        details: "Deliverable deadline for GlowSkin (₹45,000)",
      });

      expect(link.startsWith("https://calendar.google.com/calendar/render?")).toBe(true);
      expect(link).toContain("action=TEMPLATE");
      expect(link).toContain("text=Delivery%3A+GlowSkin+-+1+Reel");
      expect(link).toContain("dates=20261125%2F20261126");
      expect(link).toContain("details=Deliverable+deadline+for+GlowSkin+%28%E2%82%B945%2C000%29");
    });
  });

  describe("generateDealCalendarICS", () => {
    const mockDeal: CalendarDealData = {
      id: "abc-123",
      brandName: "GlowSkin",
      category: "Skincare",
      deliverablesSummary: "1 Reel + 2 Stories",
      agreedFeePaise: 4500000,
      status: "agreed",
      deliveryDate: "2026-11-25",
      exclusivityDays: 60,
      exclusivityStartDate: "2026-11-25",
      paymentDueDate: "2026-12-10",
      invoiceNumber: "DS/2026-27/001",
      upiId: "creator@okhdfcbank",
    };

    it("generates valid RFC 5545 format with CRLF line endings", () => {
      const ics = generateDealCalendarICS(mockDeal, "kreato.in");

      expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
      expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
      expect(ics).toContain("VERSION:2.0\r\n");
      expect(ics).toContain("CALSCALE:GREGORIAN\r\n");
      expect(ics).toContain("METHOD:PUBLISH\r\n");
    });

    it("generates stable UIDs for delivery, exclusivity, and payment events", () => {
      const ics = generateDealCalendarICS(mockDeal, "kreato.in");

      expect(ics).toContain("UID:deal-abc-123-delivery@kreato.in\r\n");
      expect(ics).toContain("UID:deal-abc-123-exclusivity@kreato.in\r\n");
      expect(ics).toContain("UID:deal-abc-123-payment@kreato.in\r\n");
    });

    it("contains VALARM reminders for deliverables and payment", () => {
      const ics = generateDealCalendarICS(mockDeal, "kreato.in");

      expect(ics).toContain("BEGIN:VALARM\r\n");
      expect(ics).toContain("TRIGGER:-P1D\r\n");
      expect(ics).toContain("TRIGGER:-P7D\r\n");
    });

    it("ensures no line exceeds 75 UTF-8 octets", () => {
      const ics = generateDealCalendarICS(mockDeal, "kreato.in");
      const lines = ics.split("\r\n");
      const encoder = new TextEncoder();

      for (const line of lines) {
        if (line.length > 0) {
          expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
        }
      }
    });
  });
});

