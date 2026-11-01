import {
  AgentProfile,
  LeadSummaryCardData,
  PropertyListing,
  LeadActivityItem,
  OnlineUser,
} from "../types/dashboard";

export const mockAgentProfile: AgentProfile = {
  name: "Fred Jhonson",
  role: "Agent",
  daysActive: 286,
  phone: "+1-202-555-0167",
  email: "jhonsonfred@gmail.com",
  location: "Los Angeles",
  agency: "Horizon Realty Group",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  stats: {
    totalListings: 1203,
    propertiesSold: 912,
    propertiesRent: 320,
  },
};

export const mockLeadSummaries: LeadSummaryCardData[] = [
  {
    id: "unassigned",
    title: "Unassigned Leads",
    updatedAt: "16 mar. 01:34 pm",
    count: 23,
    variant: "lime",
  },
  {
    id: "valuation",
    title: "Valuation Seller Leads",
    updatedAt: "16 mar. 01:34 pm",
    count: 98,
    variant: "teal",
  },
  {
    id: "potential",
    title: "Potential Seller Leads",
    updatedAt: "16 mar. 01:34 pm",
    count: 231,
    variant: "coral",
  },
];

export const mockNewObjects: PropertyListing[] = [
  {
    id: "prop-1",
    title: "Modern Architectural Villa",
    type: "Rental",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "prop-2",
    title: "Nordic Minimalist House",
    type: "Sale",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600",
  },
];

export const mockLiveFeedProperty: PropertyListing = {
  id: "live-prop-1",
  title: "Single Family Residential",
  type: "Sale",
  imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600",
  address: "305 Pomona Ave, Coronado, CA 92118",
  viewersCount: 8,
};

export const mockLeadActivities: LeadActivityItem[] = [
  {
    id: "lead-1",
    time: "Tu, 25.03 1:23 pm",
    userName: "Logan Davidson",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    activityTitle: "Follow up mail",
    badgeRole: "Agent",
    statusLabel: "Created",
    actionType: "mail",
  },
  {
    id: "lead-2",
    time: "Tu, 25.03 1:23 pm",
    userName: "Megan Pearce",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    activityTitle: "First customer call",
    badgeRole: "Lead",
    statusLabel: "Was Assigned",
    actionType: "call",
  },
  {
    id: "lead-3",
    time: "Tu, 25.03 1:23 pm",
    userName: "Mason Reynolds",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    activityTitle: "First customer call",
    badgeRole: "Lead",
    statusLabel: "Add Search",
    actionType: "search",
    searchQuery: "Coronado, Single Family Residential",
  },
];

export const mockOnlineUsers: OnlineUser[] = [
  {
    id: "user-1",
    name: "Elena Rostova",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    isOnline: true,
  },
  {
    id: "user-2",
    name: "David Chen",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    isOnline: true,
  },
  {
    id: "user-3",
    name: "Marcus Brody",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150",
    isOnline: true,
  },
];

