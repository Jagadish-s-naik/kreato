import {
  CreatorProfile,
  Deal,
  BrandLedgerMetrics,
  Invoice,
} from "../types/kreato";

export const mockCreatorProfile: CreatorProfile = {
  id: "creator_01",
  name: "Aanya Sharma",
  handle: "@aanyacreates",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  niche: "Beauty & Skincare",
  followerBand: "50k-100k",
  totalFollowers: 78500,
  phone: "+91 98765 43210",
  email: "collaborations@aanya.in",
  location: "Mumbai, Maharashtra",
  agencyOrManagement: "Independent Solo Creator",
  gstin: "27AAPCA1234F1Z5",
  supplierState: "Maharashtra",
  upiVpa: "aanya.creator@icici",
  simDaysOffset: 0,
};

export const mockDeals: Deal[] = [
  {
    id: "deal_01",
    brandName: "GlowSkin India",
    brandKey: "glowskin",
    brandDomain: "glowskin.co.in",
    category: "Beauty & Skincare",
    deliverables: [
      { format: "instagram_reel", quantity: 1 },
      { format: "instagram_story", quantity: 2 },
    ],
    deadline: "2026-11-20",
    feePaise: 2500000, // ₹25,000 (Market fair fee is ₹75,000)
    usageRights: "perpetual",
    exclusivityDays: 60,
    paymentTermsDays: 60,
    status: "incoming",
    riskyQuotes: [
      "Brand shall own all perpetual digital rights and whitelisting in perpetuity.",
      "60-day category exclusivity for all beauty brands.",
      "Payment terms: 60 days following live post verification.",
    ],
    createdAt: "2026-11-01T10:15:00Z",
  },
  {
    id: "deal_02",
    brandName: "Mamaearth",
    brandKey: "mamaearth",
    brandDomain: "mamaearth.in",
    category: "Beauty & Skincare",
    deliverables: [
      { format: "instagram_reel", quantity: 2 },
    ],
    deadline: "2026-11-28",
    feePaise: 9000000, // ₹90,000
    usageRights: "paid_ads_3m",
    exclusivityDays: 30,
    paymentTermsDays: 30,
    status: "analyzing",
    riskyQuotes: [
      "Paid ads whitelist for 90 days included in flat creator fee.",
    ],
    createdAt: "2026-10-30T14:20:00Z",
  },
  {
    id: "deal_03",
    brandName: "Nykaa Fashion",
    brandKey: "nykaa",
    brandDomain: "nykaa.com",
    category: "Fashion & Lifestyle",
    deliverables: [
      { format: "instagram_reel", quantity: 1 },
      { format: "instagram_story", quantity: 3 },
    ],
    deadline: "2026-11-15",
    feePaise: 8500000, // ₹85,000
    usageRights: "none",
    exclusivityDays: 0,
    paymentTermsDays: 15,
    status: "countered",
    riskyQuotes: [],
    createdAt: "2026-10-25T11:00:00Z",
  },
  {
    id: "deal_04",
    brandName: "Plum Goodness",
    brandKey: "plum",
    brandDomain: "plumgoodness.com",
    category: "Beauty & Skincare",
    deliverables: [
      { format: "instagram_reel", quantity: 1 },
    ],
    deadline: "2026-11-10",
    feePaise: 4500000, // ₹45,000
    usageRights: "none",
    exclusivityDays: 0,
    paymentTermsDays: 15,
    status: "agreed",
    riskyQuotes: [],
    createdAt: "2026-10-20T09:30:00Z",
    agreedAt: "2026-10-22T16:00:00Z",
  },
];

export const mockBrandLedgers: Record<string, BrandLedgerMetrics> = {
  glowskin: {
    brandKey: "glowskin",
    brandName: "GlowSkin India",
    totalDeals: 2,
    totalEarnedPaise: 4000000,
    avgPromisedDays: 30,
    avgActualDays: 68,
    avgDaysLate: 38,
    pastConcessions: [
      "Accepted 60-day delayed payment in previous deal",
      "Perpetual digital rights conceded without license fee",
    ],
  },
  mamaearth: {
    brandKey: "mamaearth",
    brandName: "Mamaearth",
    totalDeals: 4,
    totalEarnedPaise: 24000000,
    avgPromisedDays: 30,
    avgActualDays: 34,
    avgDaysLate: 4,
    pastConcessions: [
      "90-day ad whitelisting granted",
    ],
  },
};

export const mockInvoices: Invoice[] = [
  {
    id: "inv_01",
    invoiceNumber: "KR/2026-27/012",
    dealId: "deal_04",
    brandName: "Plum Goodness",
    brandGstin: "27AABCP9999K1Z2",
    brandAddress: "Unit 301, Godrej One, Vikhroli, Mumbai - 400079",
    brandState: "Maharashtra",
    issueDate: "2026-10-23",
    dueDate: "2026-11-07",
    taxableAmountPaise: 4500000, // ₹45,000
    isGstRegistered: true,
    isInterState: false, // Intra-state Maharashtra -> Maharashtra
    cgstPaise: 405000, // 9% = ₹4,050
    sgstPaise: 405000, // 9% = ₹4,050
    igstPaise: 0,
    totalAmountPaise: 5310000, // ₹53,100
    status: "issued",
    upiPaymentLink: "upi://pay?pa=aanya.creator@icici&pn=Aanya%20Sharma&am=53100.00&cu=INR&tn=Invoice%20KR/2026-27/012",
  },
  {
    id: "inv_02",
    invoiceNumber: "KR/2026-27/011",
    dealId: "deal_old_01",
    brandName: "GlowSkin India",
    brandGstin: "07AAACG5555L1Z1",
    brandAddress: "Barakhamba Road, Connaught Place, New Delhi - 110001",
    brandState: "Delhi",
    issueDate: "2026-09-15",
    dueDate: "2026-10-15",
    taxableAmountPaise: 3000000,
    isGstRegistered: true,
    isInterState: true, // Inter-state Maharashtra -> Delhi
    cgstPaise: 0,
    sgstPaise: 0,
    igstPaise: 540000, // 18% = ₹5,400
    totalAmountPaise: 3540000, // ₹35,400
    status: "overdue",
    upiPaymentLink: "upi://pay?pa=aanya.creator@icici&pn=Aanya%20Sharma&am=35400.00&cu=INR&tn=Invoice%20KR/2026-27/011",
  },
];

