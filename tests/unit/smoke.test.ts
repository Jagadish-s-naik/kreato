import { describe, it, expect } from "vitest";
import { APP_NAME } from "@/lib/config/app";

describe("DealShield Environment & Setup", () => {
  it("loads application configuration properly", () => {
    expect(APP_NAME).toBe("DealShield");
  });
});

