import {baseApi} from './baseApi';
import {API_ENDPOINTS} from '../../services/api/endpoints';
import {
  Advertisement,
  PublisherLink,
  ShareLink,
} from '../../types/campaign.types';
import {Pagination} from '../../types/api.types';

// Response types for RTK Query
interface AdvertisementListApiResponse {
  success: boolean;
  data: {
    data: Advertisement[];
    pagination: Pagination;
  };
}

interface AdvertisementDetailApiResponse {
  success: boolean;
  data: Advertisement;
}

interface CreateLinkApiResponse {
  success: boolean;
  data: ShareLink;
}

interface MyLinksApiResponse {
  success: boolean;
  data: {
    data: PublisherLink[];
    pagination: Pagination;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const publisherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get advertisements
    getAdvertisements: builder.query<
      {advertisements: Advertisement[]; pagination: Pagination},
      PaginationParams | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.PUBLISHER.ADVERTISEMENTS,
        params: params || {},
      }),
      transformResponse: (response: AdvertisementListApiResponse) => ({
        advertisements: response.data.data,
        pagination: response.data.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.advertisements.map(({id}) => ({
                type: 'Advertisements' as const,
                id,
              })),
              {type: 'Advertisements', id: 'LIST'},
            ]
          : [{type: 'Advertisements', id: 'LIST'}],
    }),

    // Get advertisement detail
    getAdvertisementDetail: builder.query<Advertisement, string>({
      query: (id) => API_ENDPOINTS.PUBLISHER.ADVERTISEMENT_DETAIL(id),
      transformResponse: (response: AdvertisementDetailApiResponse) =>
        response.data,
      providesTags: (result, error, id) => [{type: 'Advertisements', id}],
    }),

    // Create advertisement link
    createAdvertisementLink: builder.mutation<ShareLink, string>({
      query: (advertisementId) => ({
        url: API_ENDPOINTS.PUBLISHER.CREATE_LINK(advertisementId),
        method: 'POST',
      }),
      transformResponse: (response: CreateLinkApiResponse) => response.data,
      invalidatesTags: [{type: 'MyLinks', id: 'LIST'}],
    }),

    // Get my links
    getMyLinks: builder.query<
      {links: PublisherLink[]; pagination: Pagination},
      PaginationParams | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.PUBLISHER.MY_LINKS,
        params: params || {},
      }),
      transformResponse: (response: MyLinksApiResponse) => ({
        links: response.data.data,
        pagination: response.data.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.links.map(({id}) => ({type: 'MyLinks' as const, id})),
              {type: 'MyLinks', id: 'LIST'},
            ]
          : [{type: 'MyLinks', id: 'LIST'}],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdvertisementsQuery,
  useGetAdvertisementDetailQuery,
  useCreateAdvertisementLinkMutation,
  useGetMyLinksQuery,
} = publisherApi;
