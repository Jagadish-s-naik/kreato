import { WalkAwayLadderResult } from "../types/kreato";

export function computeWalkAwayLadder(params: {
  fairFeePaise: number;
  offeredFeePaise: number;
  minFeeFloorPaise?: number;
}): WalkAwayLadderResult {
  const fair = params.fairFeePaise;
  const floor = params.minFeeFloorPaise || Math.round(fair * 0.7);

  // Ideal Tier: Fair benchmark fee + usage surcharge, net-15, no uncompensated exclusivity
  const idealFee = Math.max(fair, Math.round(params.offeredFeePaise * 1.35));

  // Acceptable Tier: 90% of Fair Fee, usage up to 3 months, net-30
  const acceptableFee = Math.round(fair * 0.9);

  // Walk-away Floor: 70% of Fair Fee (or creator's configured min floor), net-45
  const walkAwayFee = floor;

  return {
    ideal: {
      name: "Ideal",
      feePaise: idealFee,
      usageRights: "Organic social only (or +25% separate paid ad license)",
      paymentTermsDays: 15,
      exclusivity: "None (or separate ₹15,000/mo fee)",
      isViable: true,
      notes: "Guarantees highest margin and clean deliverables without long-term legal lock-in.",
    },
    acceptable: {
      name: "Acceptable",
      feePaise: acceptableFee,
      usageRights: "Paid social ads capped at 90 days",
      paymentTermsDays: 30,
      exclusivity: "30 days category restriction",
      isViable: true,
      notes: "Balanced commercial compromise suitable for reputable brands with good payment track record.",
    },
    walkAway: {
      name: "Walk-away",
      feePaise: walkAwayFee,
      usageRights: "Strict organic only, max 30 days whitelisting",
      paymentTermsDays: 45,
      exclusivity: "Strictly 15 days or zero",
      isViable: params.offeredFeePaise >= walkAwayFee,
      notes:
        params.offeredFeePaise < walkAwayFee
          ? "The offered terms fall below your walk-away threshold. Accepting this deal will dilute your pricing power."
          : "Minimum viable commercial threshold. Do not concede any further terms.",
    },
  };
}

