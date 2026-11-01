import { describe, it, expect } from "vitest";
import { parseChannelInput } from "@/lib/youtube/parser";
import { mapSubscribersToBand } from "@/lib/youtube/mapper";

describe("YouTube Public Stats Module (Feature 13)", () => {
  describe("parseChannelInput", () => {
    it("parses direct handle starting with @", () => {
      const parsed = parseChannelInput("@techburner");
      expect(parsed).toEqual({ type: "handle", value: "techburner" });
    });

    it("parses full URLs with @handle across supported YouTube domains", () => {
      expect(parseChannelInput("https://youtube.com/@techburner")).toEqual({
        type: "handle",
        value: "techburner",
      });
      expect(parseChannelInput("https://www.youtube.com/@simranlifestyle")).toEqual({
        type: "handle",
        value: "simranlifestyle",
      });
      expect(parseChannelInput("https://m.youtube.com/@creators")).toEqual({
        type: "handle",
        value: "creators",
      });
    });

    it("parses UC... channel IDs from URL and raw string", () => {
      const channelId = "UCuAXFkgsw1L7xaCfnd5JJOw";
      expect(parseChannelInput(`https://www.youtube.com/channel/${channelId}`)).toEqual({
        type: "id",
        value: channelId,
      });
      expect(parseChannelInput(channelId)).toEqual({
        type: "id",
        value: channelId,
      });
    });

    it("parses custom URLs (/c/...) and legacy user URLs (/user/...)", () => {
      expect(parseChannelInput("https://www.youtube.com/c/CreatorStudio")).toEqual({
        type: "username",
        value: "CreatorStudio",
      });
      expect(parseChannelInput("https://www.youtube.com/user/OldStyleCreator")).toEqual({
        type: "username",
        value: "OldStyleCreator",
      });
    });

    it("strictly rejects untrusted or phishing hostnames", () => {
      expect(parseChannelInput("https://phishing-youtube.com/@scam")).toBeNull();
      expect(parseChannelInput("https://notyoutube.com/channel/UC1234567890123456789012")).toBeNull();
      expect(parseChannelInput("https://evil.org?target=youtube.com/@real")).toBeNull();
    });

    it("rejects empty or whitespace inputs", () => {
      expect(parseChannelInput("")).toBeNull();
      expect(parseChannelInput("   ")).toBeNull();
      expect(parseChannelInput(null as any)).toBeNull();
    });
  });

  describe("mapSubscribersToBand", () => {
    it("maps < 10k to nano", () => {
      expect(mapSubscribersToBand(0)).toBe("nano");
      expect(mapSubscribersToBand(500)).toBe("nano");
      expect(mapSubscribersToBand(9999)).toBe("nano");
    });

    it("maps 10k – 50k to micro", () => {
      expect(mapSubscribersToBand(10000)).toBe("micro");
      expect(mapSubscribersToBand(25000)).toBe("micro");
      expect(mapSubscribersToBand(49999)).toBe("micro");
    });

    it("maps 50k – 200k to mid", () => {
      expect(mapSubscribersToBand(50000)).toBe("mid");
      expect(mapSubscribersToBand(75000)).toBe("mid");
      expect(mapSubscribersToBand(199999)).toBe("mid");
    });

    it("maps 200k – 1M to macro", () => {
      expect(mapSubscribersToBand(200000)).toBe("macro");
      expect(mapSubscribersToBand(500000)).toBe("macro");
      expect(mapSubscribersToBand(999999)).toBe("macro");
    });

    it("maps 1M+ to mega", () => {
      expect(mapSubscribersToBand(1000000)).toBe("mega");
      expect(mapSubscribersToBand(5000000)).toBe("mega");
    });

    it("handles negative numbers safely as nano", () => {
      expect(mapSubscribersToBand(-100)).toBe("nano");
    });
  });
});

