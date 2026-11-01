export type Niche =
  | "Beauty & Skincare"
  | "Tech & Gadgets"
  | "Fashion & Lifestyle"
  | "Fitness & Health"
  | "Finance"
  | "Food & Beverage"
  | "Gaming"
  | "Travel"
  | "Education";

export type FollowerBand = "10k-50k" | "50k-100k" | "100k-250k" | "250k-500k";

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  niche: Niche;
  followerBand: FollowerBand;
  totalFollowers: number;
  phone: string;
  email: string;
  location: string;
  agencyOrManagement: string;
  gstin?: string;
  supplierState: string;
  upiVpa: string;
  simDaysOffset: number; // For demo time travel
}

export type DeliverableFormat =
  | "instagram_reel"
  | "instagram_story"
  | "instagram_post"
  | "youtube_dedicated"
  | "youtube_integrated"
  | "youtube_shorts";

export interface Deliverable {
  format: DeliverableFormat;
  quantity: number;
}

export type UsageRightsDuration =
  | "none"
  | "paid_ads_3m"
  | "paid_ads_6m"
  | "paid_ads_12m"
  | "perpetual";

export type DealStatus = "incoming" | "analyzing" | "countered" | "agreed" | "rejected";

export interface Deal {
  id: string;
  brandName: string;
  brandKey: string;
  brandDomain?: string;
  category: Niche;
  deliverables: Deliverable[];
  deadline: string;
  feePaise: number; // integer paise
  usageRights: UsageRightsDuration;
  exclusivityDays: number;
  paymentTermsDays: number;
  status: DealStatus;
  riskyQuotes: string[];
  createdAt: string;
  agreedAt?: string;
}

export interface RadarBreakdownItem {
  key: string;
  label: string;
  amountPaise: number;
  reason: string;
  formula: string;
  isSimulatedBenchmark?: boolean;
}

export interface RadarResult {
  totalAtRiskPaise: number;
  fairFeePaise: number;
  breakdown: RadarBreakdownItem[];
  riskLevel: "low" | "medium" | "high";
}

export interface LadderTier {
  name: "Ideal" | "Acceptable" | "Walk-away";
  feePaise: number;
  usageRights: string;
  paymentTermsDays: number;
  exclusivity: string;
  isViable: boolean;
  notes: string;
}

export interface WalkAwayLadderResult {
  ideal: LadderTier;
  acceptable: LadderTier;
  walkAway: LadderTier;
}

export interface BrandLedgerMetrics {
  brandKey: string;
  brandName: string;
  totalDeals: number;
  totalEarnedPaise: number;
  avgPromisedDays: number;
  avgActualDays: number;
  avgDaysLate: number;
  pastConcessions: string[];
}

export type InvoiceStatus = "draft" | "issued" | "overdue" | "paid";

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. DS/2026-27/001
  dealId: string;
  brandName: string;
  brandGstin?: string;
  brandAddress: string;
  brandState: string;
  issueDate: string;
  dueDate: string;
  taxableAmountPaise: number;
  isGstRegistered: boolean;
  isInterState: boolean;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalAmountPaise: number;
  status: InvoiceStatus;
  paidAt?: string;
  upiPaymentLink: string;
}

