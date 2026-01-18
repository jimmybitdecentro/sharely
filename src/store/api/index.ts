// Export base API
export {baseApi} from './baseApi';

// Export all API hooks
export {
  useGetCampaignsQuery,
  useGetCampaignDetailQuery,
  useGenerateShareLinkMutation,
} from './campaignApi';

export {
  useGetWalletBalanceQuery,
  useGetTransactionsQuery,
  useCreateWithdrawalMutation,
} from './walletApi';

export {
  useGetReferralInfoQuery,
  useApplyReferralCodeMutation,
} from './referralApi';

export {
  useGetCountriesQuery,
  useGetCitiesQuery,
  useGetCitiesByCountryQuery,
} from './locationApi';

export {
  useGetAdvertisementsQuery,
  useGetAdvertisementDetailQuery,
  useCreateAdvertisementLinkMutation,
  useGetMyLinksQuery,
} from './publisherApi';

export {
  useGetAuthProfileQuery,
  useUpdateAuthProfileMutation,
  useCreateUserProfileMutation,
} from './profileApi';
