import {baseApi} from './baseApi';
import {API_ENDPOINTS} from '../../services/api/endpoints';
import {
  Campaign,
  CampaignDetail,
  CampaignListParams,
  ShareLink,
} from '../../types/campaign.types';
import {Pagination} from '../../types/api.types';

// Response types for RTK Query
interface CampaignListApiResponse {
  success: boolean;
  data: {
    data: Campaign[];
    pagination: Pagination;
  };
}

interface CampaignDetailApiResponse {
  success: boolean;
  data: CampaignDetail;
}

interface ShareLinkApiResponse {
  success: boolean;
  data: ShareLink;
}

export const campaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get campaign list
    getCampaigns: builder.query<
      {campaigns: Campaign[]; pagination: Pagination},
      CampaignListParams | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.CAMPAIGN.LIST,
        params: params || {},
      }),
      transformResponse: (response: CampaignListApiResponse) => ({
        campaigns: response.data.data,
        pagination: response.data.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.campaigns.map(({id}) => ({type: 'Campaign' as const, id})),
              {type: 'CampaignList', id: 'LIST'},
            ]
          : [{type: 'CampaignList', id: 'LIST'}],
    }),

    // Get campaign detail
    getCampaignDetail: builder.query<CampaignDetail, string>({
      query: (id) => API_ENDPOINTS.CAMPAIGN.DETAIL(id),
      transformResponse: (response: CampaignDetailApiResponse) => response.data,
      providesTags: (result, error, id) => [{type: 'Campaign', id}],
    }),

    // Generate share link
    generateShareLink: builder.mutation<ShareLink, string>({
      query: (campaignId) => ({
        url: API_ENDPOINTS.SHARE.GENERATE(campaignId),
        method: 'POST',
      }),
      transformResponse: (response: ShareLinkApiResponse) => response.data,
      invalidatesTags: [{type: 'MyLinks', id: 'LIST'}],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCampaignsQuery,
  useGetCampaignDetailQuery,
  useGenerateShareLinkMutation,
} = campaignApi;
