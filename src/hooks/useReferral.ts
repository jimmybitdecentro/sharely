import {useCallback} from 'react';
import {
  useGetReferralInfoQuery,
  useApplyReferralCodeMutation,
} from '../store/api';
import {useAppDispatch} from '../store/hooks';
import {showSuccessToast, showErrorToast} from '../store/slices/uiSlice';

interface UseReferralOptions {
  autoFetch?: boolean;
}

export const useReferral = (options: UseReferralOptions = {}) => {
  const {autoFetch = true} = options;
  const dispatch = useAppDispatch();

  // Referral info query
  const {
    data: referralInfo,
    isLoading,
    error,
    refetch,
  } = useGetReferralInfoQuery(undefined, {
    skip: !autoFetch,
  });

  // Apply referral code mutation
  const [applyCode, {isLoading: isApplying}] = useApplyReferralCodeMutation();

  // Apply referral code
  const handleApplyReferralCode = useCallback(
    async (referralCode: string) => {
      try {
        const result = await applyCode({referralCode}).unwrap();
        dispatch(showSuccessToast({
          title: 'Success',
          message: result.message || 'Referral code applied successfully',
        }));
        return {success: true, data: result};
      } catch (err: any) {
        const errorMessage = err?.data?.error?.message || 'Failed to apply referral code';
        dispatch(showErrorToast({title: 'Error', message: errorMessage}));
        return {success: false, error: errorMessage};
      }
    },
    [applyCode, dispatch],
  );

  // Calculated values
  const myReferralCode = referralInfo?.referralCode || null;
  const referredBy = referralInfo?.referredBy || null;
  const hasBeenReferred = !!referralInfo?.referredBy;
  const referralReceived = referralInfo?.referralReceived || null;
  const referralsGiven = referralInfo?.referralsGiven || [];
  const totalReferrals = referralsGiven.length;
  const totalEarnedFromReferrals = referralsGiven.reduce(
    (sum, ref) => sum + ref.totalEarned,
    0,
  );

  return {
    // Data
    referralInfo,
    myReferralCode,
    referredBy,
    hasBeenReferred,
    referralReceived,
    referralsGiven,
    totalReferrals,
    totalEarnedFromReferrals,
    
    // Loading states
    isLoading,
    isApplying,
    
    // Error
    error: error ? 'Failed to load referral info' : null,
    
    // Actions
    refetch,
    applyReferralCode: handleApplyReferralCode,
  };
};

export default useReferral;
