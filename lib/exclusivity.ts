/**
 * Exclusivity Conflict & Overlapping Campaign Collision Engine
 */

export interface ActiveCampaign {
  id: string;
  brandName: string;
  category: string;
  startDate: string | Date;
  endDate: string | Date;
  exclusivityDays?: number | null;
}

export interface ExclusivityConflict {
  hasConflict: boolean;
  conflictingCampaigns: {
    campaignId: string;
    brandName: string;
    category: string;
    overlapDays: number;
    description: string;
  }[];
}

export function checkExclusivityConflict(options: {
  proposedCategory: string;
  proposedStartDate: string | Date;
  proposedEndDate: string | Date;
  activeCampaigns: ActiveCampaign[];
}): ExclusivityConflict {
  const { proposedCategory, proposedStartDate, proposedEndDate, activeCampaigns } = options;

  const propStart = new Date(proposedStartDate).getTime();
  const propEnd = new Date(proposedEndDate).getTime();

  const conflictingCampaigns: ExclusivityConflict["conflictingCampaigns"] = [];

  for (const campaign of activeCampaigns) {
    // Only category matches create a conflict
    if (campaign.category.toLowerCase() !== proposedCategory.toLowerCase()) {
      continue;
    }

    const campStart = new Date(campaign.startDate).getTime();
    const campEnd = new Date(campaign.endDate).getTime();

    // Check for overlap: max(start1, start2) <= min(end1, end2)
    const overlapStart = Math.max(propStart, campStart);
    const overlapEnd = Math.min(propEnd, campEnd);

    if (overlapStart <= overlapEnd) {
      const overlapDays = Math.ceil((overlapEnd - overlapStart) / 86400000) + 1;
      conflictingCampaigns.push({
        campaignId: campaign.id,
        brandName: campaign.brandName,
        category: campaign.category,
        overlapDays,
        description: `Exclusivity clash: Active ${campaign.category} partnership with "${campaign.brandName}" overlaps by ${overlapDays} days with proposed campaign window.`,
      });
    }
  }

  return {
    hasConflict: conflictingCampaigns.length > 0,
    conflictingCampaigns,
  };
}

