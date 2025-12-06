// Referral Received Info
export interface ReferralReceived {
  signupReward: number;
  activityReward: number;
  totalEarned: number;
}

// Referral Given Info
export interface ReferralGiven {
  refereeId: string;
  signupReward: number;
  totalEarned: number;
}

// Complete Referral Info
export interface ReferralInfo {
  referralCode: string;
  referredBy: string | null;
  referralReceived: ReferralReceived | null;
  referralsGiven: ReferralGiven[];
}

// Applied Referral
export interface AppliedReferral {
  id: string;
  referrerId: string;
  refereeId: string;
  signupReward: number;
  totalEarned: number;
}

// Request Types
export interface ApplyReferralRequest {
  referralCode: string;
}

// Response Types
export interface ApplyReferralResponse {
  success: boolean;
  data: {
    message: string;
    referral: AppliedReferral;
  };
}

export interface ReferralInfoResponse {
  success: boolean;
  data: ReferralInfo;
}

// Referral State for Redux (if needed)
export interface ReferralState {
  info: ReferralInfo | null;
  isLoading: boolean;
  error: string | null;
}
