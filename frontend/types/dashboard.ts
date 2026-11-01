export interface AgentProfile {
  name: string;
  role: string;
  daysActive: number;
  phone: string;
  email: string;
  location: string;
  agency: string;
  avatarUrl: string;
  stats: {
    totalListings: number;
    propertiesSold: number;
    propertiesRent: number;
  };
}

export type PastelVariant = "lime" | "teal" | "coral";

export interface LeadSummaryCardData {
  id: string;
  title: string;
  updatedAt: string;
  count: number;
  variant: PastelVariant;
}

export interface PropertyListing {
  id: string;
  title: string;
  type: "Rental" | "Sale";
  imageUrl: string;
  address?: string;
  viewersCount?: number;
}

export interface LeadActivityItem {
  id: string;
  time: string;
  userName: string;
  userAvatar: string;
  activityTitle: string;
  badgeRole?: string;
  statusLabel?: string;
  actionType: "mail" | "call" | "search";
  searchQuery?: string;
}

export interface OnlineUser {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
}

