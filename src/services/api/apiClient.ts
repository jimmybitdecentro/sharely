import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {config} from '../../config/env';
import {storageService} from '../storage/storageService';
import {ApiResponse, ApiError} from '../../types/api.types';
import {RefreshTokenResponse} from '../../types/auth.types';
import {handleApiError, getErrorMessage} from './errorHandler';
import {API_ENDPOINTS} from './endpoints';

// Type for failed request queue
interface FailedRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: FailedRequest[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: AxiosError | null, token: string | null = null): void {
    this.failedQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else if (token && request.config.headers) {
        request.config.headers.Authorization = `Bearer ${token}`;
        request.resolve(this.client(request.config));
      }
    });
    this.failedQueue = [];
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await storageService.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await axios.post<RefreshTokenResponse>(
        `${config.API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {refreshToken},
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.data.success && response.data.data) {
        const {accessToken, refreshToken: newRefreshToken} = response.data.data;
        
        // Store new tokens
        await storageService.setAuthToken(accessToken);
        await storageService.setRefreshToken(newRefreshToken);
        // Set expiry for 15 minutes (900 seconds)
        await storageService.setTokenExpiresAt(Date.now() + 900 * 1000);

        return accessToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        const token = await storageService.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Check if this is not the refresh endpoint itself
          if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
            // Refresh token is also invalid, clear auth and reject
            await this.handleAuthFailure();
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({resolve, reject, config: originalRequest});
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();

            if (newToken) {
              // Process queued requests with new token
              this.processQueue(null, newToken);
              
              // Retry the original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return this.client(originalRequest);
            } else {
              // Refresh failed, clear auth
              await this.handleAuthFailure();
              this.processQueue(error, null);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            await this.handleAuthFailure();
            this.processQueue(error, null);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle 403 forbidden
        if (error.response?.status === 403) {
          console.error('Access forbidden:', error.response?.data);
        }

        // Handle 429 rate limit
        if (error.response?.status === 429) {
          console.error('Rate limit exceeded');
        }

        // Handle 500 server errors
        if (error.response && error.response.status >= 500) {
          console.error('Server error:', error.response?.data);
        }

        return Promise.reject(error);
      },
    );
  }

  private async handleAuthFailure(): Promise<void> {
    await storageService.clearAuthData();
    // Note: Redux store logout will be handled by the auth slice/hook
    // This just clears the stored tokens
  }

  // HTTP Methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Raw request method (for special cases like auth where response format differs)
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get the underlying axios instance (for RTK Query baseQuery)
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export {getErrorMessage};
