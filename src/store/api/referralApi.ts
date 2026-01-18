import {baseApi} from './baseApi';
import {API_ENDPOINTS} from '../../services/api/endpoints';
import {
  ReferralInfo,
  ApplyReferralRequest,
  AppliedReferral,
} from '../../types/referral.types';

// Response types for RTK Query
interface ReferralInfoApiResponse {
  success: boolean;
  data: ReferralInfo;
}

interface ApplyReferralApiResponse {
  success: boolean;
  data: {
    message: string;
    referral: AppliedReferral;
  };
}

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get referral info
    getReferralInfo: builder.query<ReferralInfo, void>({
      query: () => API_ENDPOINTS.REFERRAL.INFO,
      transformResponse: (response: ReferralInfoApiResponse) => response.data,
      providesTags: ['Referral'],
    }),

    // Apply referral code
    applyReferralCode: builder.mutation<
      {message: string; referral: AppliedReferral},
      ApplyReferralRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.REFERRAL.APPLY,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApplyReferralApiResponse) => response.data,
      invalidatesTags: ['Referral', 'WalletBalance'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReferralInfoQuery,
  useApplyReferralCodeMutation,
} = referralApi;
