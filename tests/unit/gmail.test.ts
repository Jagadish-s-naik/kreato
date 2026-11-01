import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { encryptToken, decryptToken } from "@/lib/gmail/crypto";
import { sanitizeHtmlEmail } from "@/lib/gmail/sanitizer";
import { assessEmailRelevance } from "@/lib/gmail/relevance";

describe("Gmail Import Engine (Feature 14)", () => {
  const testKey = crypto.randomBytes(32);

  describe("AES-256-GCM Token Encryption", () => {
    it("successfully encrypts and decrypts OAuth tokens", () => {
      const originalToken = "ya29.a0ARrdaM8SampleSecretGoogleToken_1234567890";
      const encrypted = encryptToken(originalToken, testKey);

      expect(encrypted).not.toBe(originalToken);
      expect(encrypted.split(":").length).toBe(3); // iv:tag:ciphertext

      const decrypted = decryptToken(encrypted, testKey);
      expect(decrypted).toBe(originalToken);
    });

    it("throws an error when ciphertext is tampered with", () => {
      const originalToken = "my-secret-token";
      const encrypted = encryptToken(originalToken, testKey);
      const [iv, tag, cipher] = encrypted.split(":");

      // Flip the last byte of ciphertext
      const tamperedCipher = cipher.slice(0, -2) + (cipher.slice(-2) === "aa" ? "bb" : "aa");
      const tamperedPayload = `${iv}:${tag}:${tamperedCipher}`;

      expect(() => decryptToken(tamperedPayload, testKey)).toThrow();
    });

    it("throws an error when auth tag is modified", () => {
      const originalToken = "my-secret-token";
      const encrypted = encryptToken(originalToken, testKey);
      const [iv, tag, cipher] = encrypted.split(":");

      const tamperedTag = tag.slice(0, -2) + (tag.slice(-2) === "00" ? "ff" : "00");
      const tamperedPayload = `${iv}:${tamperedTag}:${cipher}`;

      expect(() => decryptToken(tamperedPayload, testKey)).toThrow();
    });

    it("throws an error on malformed token strings", () => {
      expect(() => decryptToken("not-a-valid-token", testKey)).toThrow();
    });
  });

  describe("HTML Email Sanitizer", () => {
    it("strips scripts, style blocks, and comments", () => {
      const rawHtml = `
        <html>
          <head><style>body { color: red; }</style></head>
          <body>
            <script>alert('hack');</script>
            <!-- internal comment -->
            <p>Hey Simran, we have a paid collaboration opportunity for you!</p>
          </body>
        </html>
      `;
      const clean = sanitizeHtmlEmail(rawHtml);
      expect(clean).not.toContain("alert");
      expect(clean).not.toContain("color: red");
      expect(clean).not.toContain("internal comment");
      expect(clean).toContain("Hey Simran, we have a paid collaboration opportunity for you!");
    });

    it("strips 1x1 tracking pixels", () => {
      const htmlWithPixel = `
        <p>Campaign details attached.</p>
        <img src="https://track.mail.com/open?id=123" width="1" height="1" alt="" />
        <img src="https://track.mail.com/open2?id=456" width="0" height="0" />
      `;
      const clean = sanitizeHtmlEmail(htmlWithPixel);
      expect(clean).not.toContain("track.mail.com");
      expect(clean).toContain("Campaign details attached.");
    });

    it("truncates quoted reply threads and blockquotes", () => {
      const emailWithHistory = `
        Hi Simran,

        Thanks for your reply! Our budget is ₹35,000 for 1 Reel.

        On Mon, Nov 1, 2026 at 2:15 PM Simran Naik <simran@creator.in> wrote:
        > Hey Pooja, what is the commercials and deliverables?
        > Let me know your timeline.
      `;
      const clean = sanitizeHtmlEmail(emailWithHistory);
      expect(clean).toContain("Our budget is ₹35,000 for 1 Reel.");
      expect(clean).not.toContain("Simran Naik <simran@creator.in> wrote:");
      expect(clean).not.toContain("what is the commercials and deliverables?");
    });

    it("decodes HTML entities properly", () => {
      const html = "Deliverables: 1 Reel &amp; 2 Stories &nbsp; for &quot;GlowSkin&#39;s&quot; campaign";
      const clean = sanitizeHtmlEmail(html);
      expect(clean).toBe('Deliverables: 1 Reel & 2 Stories for "GlowSkin\'s" campaign');
    });
  });

  describe("Sponsorship Relevance Scoring", () => {
    it("identifies high-probability brand deals from corporate senders", () => {
      const result = assessEmailRelevance(
        "Brand Collaboration: GlowSkin x Simran",
        "We are looking for creators for our upcoming campaign. Budget is ₹50,000 with net-30 terms.",
        "pooja@glowskin.in"
      );

      expect(result.isLikelyBrandOffer).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.reasons).toEqual(
        expect.arrayContaining([
          expect.stringContaining("collaboration"),
        ])
      );
    });

    it("marks normal personal or transactional emails as low relevance", () => {
      const result = assessEmailRelevance(
        "Dinner this Friday?",
        "Hey! Are we still meeting for dinner this weekend? Let me know.",
        "friend@gmail.com"
      );

      expect(result.isLikelyBrandOffer).toBe(false);
      expect(result.score).toBeLessThan(40);
    });

    it("distinguishes corporate domain boost from free email domains", () => {
      const corporate = assessEmailRelevance("Campaign query", "reel deliverables", "marketing@mamaearth.in");
      const free = assessEmailRelevance("Campaign query", "reel deliverables", "randomuser@gmail.com");

      expect(corporate.score).toBeGreaterThan(free.score);
    });
  });
});
