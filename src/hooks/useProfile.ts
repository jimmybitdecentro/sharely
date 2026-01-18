import {useCallback} from 'react';
import {
  useGetAuthProfileQuery,
  useUpdateAuthProfileMutation,
  useCreateUserProfileMutation,
} from '../store/api';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {updateUser} from '../store/slices/authSlice';
import {showSuccessToast, showErrorToast} from '../store/slices/uiSlice';
import {
  UpdateProfileRequest,
  CreateUserProfileRequest,
} from '../types/auth.types';

interface UseProfileOptions {
  autoFetch?: boolean;
}

export const useProfile = (options: UseProfileOptions = {}) => {
  const {autoFetch = false} = options;
  const dispatch = useAppDispatch();
  
  // Get user from auth state (primary source)
  const authUser = useAppSelector((state) => state.auth.user);

  // Profile query (for fetching fresh data)
  const {
    data: profileData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetAuthProfileQuery(undefined, {
    skip: !autoFetch,
  });

  // Update auth profile mutation
  const [updateAuthProfile, {isLoading: isUpdatingAuth}] = useUpdateAuthProfileMutation();

  // Create/update user profile mutation
  const [createUserProfile, {isLoading: isUpdatingUser}] = useCreateUserProfileMutation();

  // Update auth profile (name, email)
  const handleUpdateAuthProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      try {
        const result = await updateAuthProfile(data).unwrap();
        // Update Redux auth state
        dispatch(updateUser(result));
        dispatch(showSuccessToast({
          title: 'Success',
          message: 'Profile updated successfully',
        }));
        return {success: true, data: result};
      } catch (err: any) {
        const errorMessage = err?.data?.error?.message || 'Failed to update profile';
        dispatch(showErrorToast({title: 'Error', message: errorMessage}));
        return {success: false, error: errorMessage};
      }
    },
    [updateAuthProfile, dispatch],
  );

  // Update extended profile (age, gender, country, city)
  const handleUpdateExtendedProfile = useCallback(
    async (data: CreateUserProfileRequest) => {
      try {
        const result = await createUserProfile(data).unwrap();
        // Update Redux auth state with new data
        dispatch(updateUser({
          name: result.name,
          email: result.email,
        }));
        dispatch(showSuccessToast({
          title: 'Success',
          message: 'Profile updated successfully',
        }));
        return {success: true, data: result};
      } catch (err: any) {
        const errorMessage = err?.data?.error?.message || 'Failed to update profile';
        dispatch(showErrorToast({title: 'Error', message: errorMessage}));
        return {success: false, error: errorMessage};
      }
    },
    [createUserProfile, dispatch],
  );

  // Combined profile data
  const profile = profileData || authUser;

  return {
    // Data
    profile,
    user: authUser,
    
    // Loading states
    isFetching,
    isUpdating: isUpdatingAuth || isUpdatingUser,
    isUpdatingAuth,
    isUpdatingUser,
    
    // Error
    error: fetchError ? 'Failed to load profile' : null,
    
    // Actions
    refetch,
    updateAuthProfile: handleUpdateAuthProfile,
    updateExtendedProfile: handleUpdateExtendedProfile,
  };
};

export default useProfile;
