/**
 * Creator Follower & Subscriber Band Definitions
 * Used for simulated benchmark rate cards and YouTube stats mapping.
 */

export type FollowerBand = "nano" | "micro" | "mid" | "macro" | "mega";

export interface BandConfig {
  band: FollowerBand;
  label: string;
  minFollowers: number;
  maxFollowers: number;
}

export const FOLLOWER_BANDS: Record<FollowerBand, BandConfig> = {
  nano: {
    band: "nano",
    label: "Nano (< 10k)",
    minFollowers: 0,
    maxFollowers: 9_999,
  },
  micro: {
    band: "micro",
    label: "Micro (10k – 50k)",
    minFollowers: 10_000,
    maxFollowers: 49_999,
  },
  mid: {
    band: "mid",
    label: "Mid-tier (50k – 200k)",
    minFollowers: 50_000,
    maxFollowers: 199_999,
  },
  macro: {
    band: "macro",
    label: "Macro (200k – 1M)",
    minFollowers: 200_000,
    maxFollowers: 999_999,
  },
  mega: {
    band: "mega",
    label: "Mega (1M+)",
    minFollowers: 1_000_000,
    maxFollowers: Number.MAX_SAFE_INTEGER,
  },
};

