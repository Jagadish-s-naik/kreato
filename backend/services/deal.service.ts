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
    .select("id, brand_name, brand_key, fee_paise, status, category, deliverables, usage_rights, payment_terms, exclusivity, deadline, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

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
    const key = d.brand_key || "unknown_brand";
    if (!brandMap[key]) {
      brandMap[key] = {
        brandKey: key,
        brandName: d.brand_name || "Direct Sponsorship",
        category: d.category || "General",
        totalDeals: 0,
        totalContractedPaise: 0,
        totalEarnedPaise: 0,
        dealIds: [],
        deals: [],
        payments: [],
        promisedTermsList: [],
        concessionsSet: new Set<string>(),
      };
    }

    const b = brandMap[key];
    b.totalDeals += 1;
    b.dealIds.push(d.id);
    b.totalContractedPaise += (d.fee_paise || 0);

    const payTerms = typeof d.payment_terms === "object"
      ? d.payment_terms?.days || d.payment_terms?.net_days || 30
      : (d.payment_terms || 30);
    b.promisedTermsList.push(Number(payTerms) || 30);

    // Concessions analysis
    const rights = typeof d.usage_rights === "string" ? d.usage_rights : d.usage_rights?.type;
    if (rights === "perpetual") {
      b.concessionsSet.add("Perpetual commercial rights conceded without licensing surcharge");
    } else if (rights === "paid_ads" || d.usage_rights?.paid_ads_allowed) {
      b.concessionsSet.add("Paid ad whitelisting granted");
    }

    if (payTerms > 30) {
      b.concessionsSet.add(`Accepted extended Net-${payTerms} delayed settlement`);
    }

    const excl = typeof d.exclusivity === "object" ? d.exclusivity?.days : (d.exclusivity || 0);
    if (excl > 30) {
      b.concessionsSet.add(`Conceded ${excl}-day category lockout exclusivity`);
    }

    b.deals.push({
      id: d.id,
      feePaise: d.fee_paise || 0,
      status: d.status,
      category: d.category,
      deliverables: d.deliverables,
      usageRights: rights || "organic",
      paymentTermsDays: payTerms,
      exclusivityDays: excl,
      createdAt: d.created_at,
    });
  }

  for (const p of payments || []) {
    for (const bKey of Object.keys(brandMap)) {
      if (brandMap[bKey].dealIds.includes(p.deal_id)) {
        brandMap[bKey].payments.push(p);
        brandMap[bKey].totalEarnedPaise += (p.amount_paise || 0);
      }
    }
  }

  return Object.values(brandMap).map((b: any) => {
    let totalLateDays = 0;
    let onTimeCount = 0;
    for (const p of b.payments) {
      const late = Math.max(0, (p.actual_days || 0) - (p.promised_days || 0));
      totalLateDays += late;
      if (late <= 0) onTimeCount++;
    }

    const settledCount = b.payments.length;
    const avgDaysLate = settledCount > 0 ? Math.round(totalLateDays / settledCount) : 0;
    const onTimeRate = settledCount > 0 ? Math.round((onTimeCount / settledCount) * 100) : 100;

    const avgPromisedDays = b.promisedTermsList.length > 0
      ? Math.round(b.promisedTermsList.reduce((a: number, c: number) => a + c, 0) / b.promisedTermsList.length)
      : 30;

    const avgActualDays = avgPromisedDays + avgDaysLate;

    let reliabilityTier: "prompt" | "moderate" | "risky" = "prompt";
    if (avgDaysLate > 20) {
      reliabilityTier = "risky";
    } else if (avgDaysLate > 7) {
      reliabilityTier = "moderate";
    }

    const finalEarnedPaise = b.totalEarnedPaise > 0 ? b.totalEarnedPaise : b.totalContractedPaise;
    const pastConcessions = Array.from(b.concessionsSet);

    return {
      brandKey: b.brandKey,
      brandName: b.brandName,
      category: b.category,
      totalDeals: b.totalDeals,
      totalEarnedPaise: finalEarnedPaise,
      totalContractedPaise: b.totalContractedPaise,
      avgPromisedDays,
      avgActualDays,
      avgDaysLate,
      onTimeRate,
      reliabilityTier,
      pastConcessions,
      settledPaymentsCount: settledCount,
      deals: b.deals,

      // Aliases
      brand_key: b.brandKey,
      brand_name: b.brandName,
      total_deals: b.totalDeals,
      total_paid_paise: finalEarnedPaise,
      typical_payment_terms: avgPromisedDays,
      avg_days_late: avgDaysLate,
      past_concessions: pastConcessions.join(". "),
    };
  });
}
