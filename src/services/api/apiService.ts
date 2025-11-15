import {apiClient} from './apiClient';
import {API_ENDPOINTS} from './endpoints';
import {ApiResponse} from '../../types/api';
import {User} from '../../types';

class ApiService {
  // Auth APIs
  async login(email: string, password: string): Promise<ApiResponse<{token: string; user: User}>> {
    return apiClient.post(API_ENDPOINTS.LOGIN, {email, password});
  }

  async loginSocial(provider: string, token: string): Promise<ApiResponse<{token: string; user: User}>> {
    return apiClient.post(API_ENDPOINTS.LOGIN_SOCIAL, {provider, token});
  }

  async signup(data: any): Promise<ApiResponse<{token: string; user: User}>> {
    return apiClient.post(API_ENDPOINTS.SIGNUP, data);
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, {email});
  }

  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post(API_ENDPOINTS.LOGOUT);
  }

  // User APIs
  async getUserProfile(): Promise<ApiResponse<User>> {
    return apiClient.get(API_ENDPOINTS.USER_PROFILE);
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {currentPassword, newPassword});
  }

  // Campaign APIs
  async getCampaigns(params?: any): Promise<ApiResponse<any[]>> {
    return apiClient.get(API_ENDPOINTS.CAMPAIGNS, {params});
  }

  async getCampaignDetail(id: string): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.CAMPAIGN_DETAIL(id));
  }

  async getMyLinks(params?: any): Promise<ApiResponse<any[]>> {
    return apiClient.get(API_ENDPOINTS.MY_LINKS, {params});
  }

  async shareCampaign(id: string, data: any): Promise<ApiResponse<any>> {
    return apiClient.post(API_ENDPOINTS.SHARE_CAMPAIGN(id), data);
  }

  // Earnings APIs
  async getEarnings(): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.EARNINGS);
  }

  async getEarningsStats(): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.EARNINGS_STATS);
  }

  async withdraw(data: any): Promise<ApiResponse<any>> {
    return apiClient.post(API_ENDPOINTS.WITHDRAW, data);
  }

  async getTransactionHistory(params?: any): Promise<ApiResponse<any[]>> {
    return apiClient.get(API_ENDPOINTS.TRANSACTION_HISTORY, {params});
  }

  // Orders APIs
  async getMyOrders(params?: any): Promise<ApiResponse<any[]>> {
    return apiClient.get(API_ENDPOINTS.MY_ORDERS, {params});
  }

  async getOrderDetail(id: string): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.ORDER_DETAIL(id));
  }

  // Notifications APIs
  async getNotifications(params?: any): Promise<ApiResponse<any[]>> {
    return apiClient.get(API_ENDPOINTS.NOTIFICATIONS, {params});
  }

  async getNotificationSettings(): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.NOTIFICATION_SETTINGS);
  }

  async updateNotificationSettings(data: any): Promise<ApiResponse<any>> {
    return apiClient.put(API_ENDPOINTS.UPDATE_NOTIFICATION_SETTINGS, data);
  }
}

export const apiService = new ApiService();

