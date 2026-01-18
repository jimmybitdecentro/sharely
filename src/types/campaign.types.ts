// Campaign Status
export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DRAFT';

// Reward Rules
export interface RewardRules {
  baseReward: number;
  rewardPerClick: number;
  rewardPerView: number;
  rewardPerReshare: number;
}

// Campaign Analytics
export interface CampaignAnalytics {
  totalShares: number;
  totalClicks: number;
  uniqueClicks: number;
  totalReshares: number;
  totalRewards: number;
  ctr: number;
}

// Campaign
export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail: string | null;
  imageUrl: string | null;
  budget: number;
  spent: number;
  ppv: number | null;
  currency: string | null;
  currencySymbol: string | null;
  status: CampaignStatus;
  endDate: string | null;
  rewardRules: RewardRules;
  analytics: CampaignAnalytics;
  createdAt: string;
  updatedAt: string;
}

// Campaign with Terms (for detail view)
export interface CampaignDetail extends Campaign {
  terms?: string[];
}

// Share Link
export interface ShareLink {
  id: string;
  shortCode: string;
  shortUrl: string;
  fullUrl: string;
  campaignId: string;
  createdAt: string;
}

// Publisher Link (with clicks)
export interface PublisherLink extends ShareLink {
  advertisementId?: string;
  clicks: number;
}

// Advertisement (for publishers)
export interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  budget: number;
  spent: number;
  status: CampaignStatus;
  createdAt: string;
}

// Request Types
export interface CampaignListParams {
  page?: number;
  limit?: number;
  status?: CampaignStatus;
}

// Response Types
export interface CampaignListResponse {
  success: boolean;
  data: {
    data: Campaign[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CampaignDetailResponse {
  success: boolean;
  data: CampaignDetail;
}

export interface GenerateShareLinkResponse {
  success: boolean;
  data: ShareLink;
}

export interface AdvertisementListResponse {
  success: boolean;
  data: {
    data: Advertisement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  };
}

export interface PublisherLinksResponse {
  success: boolean;
  data: {
    data: PublisherLink[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
