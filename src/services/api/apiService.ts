import {apiClient} from './apiClient';
import {API_ENDPOINTS} from './endpoints';
import {
  SendOTPRequest,
  VerifyOTPRequest,
  VerifyOTPResponse,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  CreateUserProfileRequest,
  CreateUserProfileResponse,
} from '../../types/auth.types';
import {
  CampaignListParams,
  CampaignListResponse,
  CampaignDetailResponse,
  GenerateShareLinkResponse,
  AdvertisementListResponse,
  PublisherLinksResponse,
} from '../../types/campaign.types';
import {
  WalletBalanceResponse,
  WalletTransactionsResponse,
  TransactionListParams,
  WithdrawalRequest,
  WithdrawalResponse,
} from '../../types/wallet.types';
import {
  ApplyReferralRequest,
  ApplyReferralResponse,
  ReferralInfoResponse,
} from '../../types/referral.types';
import {
  CountriesResponse,
  CitiesResponse,
} from '../../types/location.types';
import {HealthResponse} from '../../types/api.types';

class ApiService {
  // Health Check
  async healthCheck(): Promise<HealthResponse> {
    return apiClient.request<HealthResponse>({
      method: 'GET',
      url: API_ENDPOINTS.HEALTH,
    });
  }

  // ============ Authentication APIs ============
  
  async sendOTP(data: SendOTPRequest): Promise<void> {
    // Returns 200 for existing user, 201 for new user
    await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, data);
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    // Response format is different from standard API response
    return apiClient.request<VerifyOTPResponse>({
      method: 'POST',
      url: API_ENDPOINTS.AUTH.VERIFY_OTP,
      data,
    });
  }

  async getAuthProfile(): Promise<GetProfileResponse> {
    const response = await apiClient.get<GetProfileResponse['data']>(
      API_ENDPOINTS.AUTH.PROFILE,
    );
    return response as unknown as GetProfileResponse;
  }

  async updateAuthProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await apiClient.put<UpdateProfileResponse['data']>(
      API_ENDPOINTS.AUTH.PROFILE,
      data,
    );
    return response as unknown as UpdateProfileResponse;
  }

  // ============ User Profile APIs ============
  
  async createUserProfile(data: CreateUserProfileRequest): Promise<CreateUserProfileResponse> {
    const response = await apiClient.post<CreateUserProfileResponse['data']>(
      API_ENDPOINTS.USER.PROFILE,
      data,
    );
    return response as unknown as CreateUserProfileResponse;
  }

  // ============ Campaign APIs ============
  
  async getCampaigns(params?: CampaignListParams): Promise<CampaignListResponse> {
    const response = await apiClient.get<CampaignListResponse['data']>(
      API_ENDPOINTS.CAMPAIGN.LIST,
      {params},
    );
    return response as unknown as CampaignListResponse;
  }

  async getCampaignDetail(id: string): Promise<CampaignDetailResponse> {
    const response = await apiClient.get<CampaignDetailResponse['data']>(
      API_ENDPOINTS.CAMPAIGN.DETAIL(id),
    );
    return response as unknown as CampaignDetailResponse;
  }

  // ============ Share Link APIs ============
  
  async generateShareLink(campaignId: string): Promise<GenerateShareLinkResponse> {
    const response = await apiClient.post<GenerateShareLinkResponse['data']>(
      API_ENDPOINTS.SHARE.GENERATE(campaignId),
    );
    return response as unknown as GenerateShareLinkResponse;
  }

  // ============ Wallet APIs ============
  
  async getWalletBalance(): Promise<WalletBalanceResponse> {
    const response = await apiClient.get<WalletBalanceResponse['data']>(
      API_ENDPOINTS.WALLET.BALANCE,
    );
    return response as unknown as WalletBalanceResponse;
  }

  async getWalletTransactions(params?: TransactionListParams): Promise<WalletTransactionsResponse> {
    const response = await apiClient.get<WalletTransactionsResponse['data']>(
      API_ENDPOINTS.WALLET.TRANSACTIONS,
      {params},
    );
    return response as unknown as WalletTransactionsResponse;
  }

  async withdraw(data: WithdrawalRequest): Promise<WithdrawalResponse> {
    const response = await apiClient.post<WithdrawalResponse['data']>(
      API_ENDPOINTS.WALLET.WITHDRAW,
      data,
    );
    return response as unknown as WithdrawalResponse;
  }

  // ============ Referral APIs ============
  
  async applyReferralCode(data: ApplyReferralRequest): Promise<ApplyReferralResponse> {
    const response = await apiClient.post<ApplyReferralResponse['data']>(
      API_ENDPOINTS.REFERRAL.APPLY,
      data,
    );
    return response as unknown as ApplyReferralResponse;
  }

  async getReferralInfo(): Promise<ReferralInfoResponse> {
    const response = await apiClient.get<ReferralInfoResponse['data']>(
      API_ENDPOINTS.REFERRAL.INFO,
    );
    return response as unknown as ReferralInfoResponse;
  }

  // ============ Location APIs ============
  
  async getCountries(): Promise<CountriesResponse> {
    const response = await apiClient.get<CountriesResponse['data']>(
      API_ENDPOINTS.LOCATION.COUNTRIES,
    );
    return response as unknown as CountriesResponse;
  }

  async getCities(): Promise<CitiesResponse> {
    const response = await apiClient.get<CitiesResponse['data']>(
      API_ENDPOINTS.LOCATION.CITIES,
    );
    return response as unknown as CitiesResponse;
  }

  // ============ Publisher APIs ============
  
  async getAdvertisements(params?: {page?: number; limit?: number}): Promise<AdvertisementListResponse> {
    const response = await apiClient.get<AdvertisementListResponse['data']>(
      API_ENDPOINTS.PUBLISHER.ADVERTISEMENTS,
      {params},
    );
    return response as unknown as AdvertisementListResponse;
  }

  async getAdvertisementDetail(id: string): Promise<any> {
    return apiClient.get(API_ENDPOINTS.PUBLISHER.ADVERTISEMENT_DETAIL(id));
  }

  async createAdvertisementLink(advertisementId: string): Promise<GenerateShareLinkResponse> {
    const response = await apiClient.post<GenerateShareLinkResponse['data']>(
      API_ENDPOINTS.PUBLISHER.CREATE_LINK(advertisementId),
    );
    return response as unknown as GenerateShareLinkResponse;
  }

  async getMyLinks(params?: {page?: number; limit?: number}): Promise<PublisherLinksResponse> {
    const response = await apiClient.get<PublisherLinksResponse['data']>(
      API_ENDPOINTS.PUBLISHER.MY_LINKS,
      {params},
    );
    return response as unknown as PublisherLinksResponse;
  }
}

export const apiService = new ApiService();
