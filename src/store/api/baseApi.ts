import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {config} from '../../config/env';
import {storageService} from '../../services/storage/storageService';
import {API_ENDPOINTS} from '../../services/api/endpoints';
import {RefreshTokenResponse} from '../../types/auth.types';
import {logout, setTokens} from '../slices/authSlice';

// Base query with auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: config.API_BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await storageService.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = await storageService.getRefreshToken();

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: API_ENDPOINTS.AUTH.REFRESH,
          method: 'POST',
          body: {refreshToken},
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const data = refreshResult.data as RefreshTokenResponse;
        if (data.success && data.data) {
          // Store new tokens
          await storageService.setAuthToken(data.data.accessToken);
          await storageService.setRefreshToken(data.data.refreshToken);
          await storageService.setTokenExpiresAt(Date.now() + 900 * 1000);

          // Update Redux state
          api.dispatch(
            setTokens({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            }),
          );

          // Retry the original query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout
          await storageService.clearAuthData();
          api.dispatch(logout());
        }
      } else {
        // Refresh request failed, logout
        await storageService.clearAuthData();
        api.dispatch(logout());
      }
    } else {
      // No refresh token, logout
      await storageService.clearAuthData();
      api.dispatch(logout());
    }
  }

  return result;
};

// Create the base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Campaign',
    'CampaignList',
    'WalletBalance',
    'Transactions',
    'Referral',
    'Profile',
    'Countries',
    'Cities',
    'Advertisements',
    'MyLinks',
  ],
  endpoints: () => ({}),
});
