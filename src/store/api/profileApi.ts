import {baseApi} from './baseApi';
import {API_ENDPOINTS} from '../../services/api/endpoints';
import {
  UserProfile,
  ExtendedUserProfile,
  UpdateProfileRequest,
  CreateUserProfileRequest,
} from '../../types/auth.types';

// Response types for RTK Query
interface ProfileApiResponse {
  success: boolean;
  data: UserProfile;
}

interface ExtendedProfileApiResponse {
  success: boolean;
  data: ExtendedUserProfile;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get auth profile (from /auth/profile)
    getAuthProfile: builder.query<UserProfile, void>({
      query: () => API_ENDPOINTS.AUTH.PROFILE,
      transformResponse: (response: ProfileApiResponse) => response.data,
      providesTags: ['Profile'],
    }),

    // Update auth profile (PUT /auth/profile)
    updateAuthProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.PROFILE,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ProfileApiResponse) => response.data,
      invalidatesTags: ['Profile'],
    }),

    // Create/update user profile (POST /users/profile)
    createUserProfile: builder.mutation<
      ExtendedUserProfile,
      CreateUserProfileRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.USER.PROFILE,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ExtendedProfileApiResponse) => response.data,
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAuthProfileQuery,
  useUpdateAuthProfileMutation,
  useCreateUserProfileMutation,
} = profileApi;
