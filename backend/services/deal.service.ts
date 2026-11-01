import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "../supabase/database.types";
import { computeRadar, RadarResult } from "@/lib/radar";
import { computeLadder, LadderTiers } from "@/lib/ladder";
import { slugifyBrandName, calculateAverageDaysLate } from "@/lib/ledger";

export { slugifyBrandName };

export interface BrandLedgerStats {
  brandKey: string;
  brandName: string;
  totalDeals: number;
  totalEarnedPaise: number;
  avgDaysLate: number;
  onTimeDealsCount: number;
  lateDealsCount: number;
  pastDeals: {
    id: string;
    brandName: string;
    feePaise: number | null;
    status: string;
    createdAt: string;
  }[];
}

/**
 * Fetches creator's Personal Brand Ledger statistics for repeat brand risk assessment.
 */
export async function getBrandLedgerStats(
  supabase: SupabaseClient<any, any, any>,
  userId: string,
  brandKey: string
): Promise<BrandLedgerStats> {
  // Query all deals with this brand key for the user
  const { data: deals, error: dealsError } = await supabase
    .from("deals")
    .select("id, brand_name, fee_paise, status, created_at")
    .eq("user_id", userId)
    .eq("brand_key", brandKey);

  if (dealsError || !deals || deals.length === 0) {
    return {
      brandKey,
      brandName: brandKey.replace(/_/g, " "),
      totalDeals: 0,
      totalEarnedPaise: 0,
      avgDaysLate: 0,
      onTimeDealsCount: 0,
      lateDealsCount: 0,
      pastDeals: [],
    };
  }

  const dealIds = deals.map((d) => d.id);

  // Query payments for these deals to calculate historical delays
  const { data: payments } = await supabase
    .from("payments")
    .select("deal_id, promised_days, actual_days, amount_paise")
    .in("deal_id", dealIds);

  let totalEarnedPaise = 0;
  let totalDaysLate = 0;
  let onTimeDealsCount = 0;
  let lateDealsCount = 0;
  const paymentCount = payments?.length || 0;

  if (payments && payments.length > 0) {
    for (const p of payments) {
      totalEarnedPaise += p.amount_paise;
      const daysLate = Math.max(0, p.actual_days - p.promised_days);
      totalDaysLate += daysLate;
      if (daysLate > 0) {
        lateDealsCount++;
      } else {
        onTimeDealsCount++;
      }
    }
  }

  const avgDaysLate = paymentCount > 0 ? Math.round(totalDaysLate / paymentCount) : 0;

  return {
    brandKey,
    brandName: deals[0]?.brand_name || brandKey,
    totalDeals: deals.length,
    totalEarnedPaise,
    avgDaysLate,
    onTimeDealsCount,
    lateDealsCount,
    pastDeals: deals.map((d) => ({
      id: d.id,
      brandName: d.brand_name,
      feePaise: d.fee_paise,
      status: d.status,
      createdAt: d.created_at,
    })),
  };
}

/**
 * Loads benchmark rate cards from Supabase for a creator's niche and follower band.
 */
export async function getBenchmarkMedians(
  supabase: SupabaseClient<any, any, any>,
  niche: Database["public"]["Enums"]["creator_niche"],
  followerBand: Database["public"]["Enums"]["follower_band"]
): Promise<Record<string, number>> {
  const { data: rows, error } = await supabase
    .from("benchmarks")
    .select("format, median_paise")
    .eq("niche", niche)
    .eq("follower_band", followerBand);

  if (error || !rows) {
    console.error("Failed to fetch benchmarks:", error);
    return {};
  }

  const medians: Record<string, number> = {};
  for (const r of rows) {
    medians[r.format] = r.median_paise;
  }
  return medians;
}

/**
 * Aggregates all brand partnerships and payment metrics for a creator's Personal Brand Ledger.
 */
export async function getPersonalBrandLedger(
  supabase: SupabaseClient<any, any, any>,
  userId: string
) {
  const { data: dealsData, error: dealsError } = await supabase
    .from("deals")
    .select("id, brand_name, brand_key, fee_paise, status, created_at")
    .eq("user_id", userId);

  if (dealsError) throw dealsError;

  const { data: paymentsData, error: paymentsError } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId);

  if (paymentsError) throw paymentsError;

  const deals = (dealsData || []) as any[];
  const payments = (paymentsData || []) as any[];

  const brandMap: Record<string, any> = {};

  for (const d of deals) {
    if (!brandMap[d.brand_key]) {
      brandMap[d.brand_key] = {
        brandKey: d.brand_key,
        brandName: d.brand_name,
        totalDeals: 0,
        totalEarnedPaise: 0,
        dealIds: [],
        payments: [],
        avgDaysLate: 0,
      };
    }
    brandMap[d.brand_key].totalDeals += 1;
    brandMap[d.brand_key].dealIds.push(d.id);
  }

  for (const p of payments || []) {
    for (const bKey of Object.keys(brandMap)) {
      if (brandMap[bKey].dealIds.includes(p.deal_id)) {
        brandMap[bKey].payments.push(p);
        brandMap[bKey].totalEarnedPaise += p.amount_paise;
      }
    }
  }

  return Object.values(brandMap).map((b: any) => {
    let totalLateDays = 0;
    for (const p of b.payments) {
      totalLateDays += Math.max(0, p.actual_days - p.promised_days);
    }
    const avgDaysLate = b.payments.length > 0 ? Math.round(totalLateDays / b.payments.length) : 0;
    return {
      brandKey: b.brandKey,
      brandName: b.brandName,
      totalDeals: b.totalDeals,
      totalEarnedPaise: b.totalEarnedPaise,
      avgDaysLate,
      settledPaymentsCount: b.payments.length,
    };
  });
}
