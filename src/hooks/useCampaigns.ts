import {useState, useCallback} from 'react';
import {
  useGetCampaignsQuery,
  useGetCampaignDetailQuery,
  useGenerateShareLinkMutation,
} from '../store/api';
import {useAppDispatch} from '../store/hooks';
import {showSuccessToast, showErrorToast} from '../store/slices/uiSlice';
import {CampaignListParams, CampaignStatus} from '../types/campaign.types';

interface UseCampaignsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: CampaignStatus;
}

export const useCampaigns = (options: UseCampaignsOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialStatus,
  } = options;

  const dispatch = useAppDispatch();
  
  // Pagination state
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [status, setStatus] = useState<CampaignStatus | undefined>(initialStatus);

  // Query params
  const queryParams: CampaignListParams = {
    page,
    limit,
    ...(status && {status}),
  };

  // RTK Query hook
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCampaignsQuery(queryParams);

  // Generate share link mutation
  const [generateLink, {isLoading: isGeneratingLink}] = useGenerateShareLinkMutation();

  // Load next page
  const loadNextPage = useCallback(() => {
    if (data?.pagination && page < data.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [data?.pagination, page]);

  // Load previous page
  const loadPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  // Reset to first page
  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  // Change status filter
  const changeStatus = useCallback((newStatus?: CampaignStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when filter changes
  }, []);

  // Generate share link
  const handleGenerateShareLink = useCallback(
    async (campaignId: string) => {
      try {
        const result = await generateLink(campaignId).unwrap();
        dispatch(showSuccessToast({
          title: 'Link Generated',
          message: 'Share link created successfully',
        }));
        return {success: true, data: result};
      } catch (err: any) {
        const errorMessage = err?.data?.error?.message || 'Failed to generate share link';
        dispatch(showErrorToast({title: 'Error', message: errorMessage}));
        return {success: false, error: errorMessage};
      }
    },
    [generateLink, dispatch],
  );

  return {
    // Data
    campaigns: data?.campaigns || [],
    pagination: data?.pagination || null,
    
    // Loading states
    isLoading,
    isFetching,
    isGeneratingLink,
    
    // Error
    error: error ? 'Failed to load campaigns' : null,
    
    // Pagination controls
    page,
    hasNextPage: data?.pagination ? page < data.pagination.totalPages : false,
    hasPreviousPage: page > 1,
    loadNextPage,
    loadPreviousPage,
    resetPagination,
    
    // Filter controls
    status,
    changeStatus,
    
    // Actions
    refetch,
    generateShareLink: handleGenerateShareLink,
  };
};

// Hook for single campaign detail
export const useCampaignDetail = (campaignId: string) => {
  const dispatch = useAppDispatch();
  
  const {
    data: campaign,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCampaignDetailQuery(campaignId, {
    skip: !campaignId,
  });

  // Generate share link mutation
  const [generateLink, {isLoading: isGenerating}] = useGenerateShareLinkMutation();

  // Generate share link for this campaign
  const generateShareLink = useCallback(async () => {
    try {
      const result = await generateLink(campaignId).unwrap();
      dispatch(showSuccessToast({
        title: 'Link Generated',
        message: 'Share link created successfully',
      }));
      return {success: true, shareLink: result};
    } catch (err: any) {
      const errorMessage = err?.data?.error?.message || 'Failed to generate share link';
      dispatch(showErrorToast({title: 'Error', message: errorMessage}));
      return {success: false, error: errorMessage, shareLink: null};
    }
  }, [generateLink, campaignId, dispatch]);

  return {
    campaign,
    isLoading,
    isFetching,
    error: error ? 'Failed to load campaign details' : null,
    refetch,
    generateShareLink,
    isGenerating,
  };
};

export default useCampaigns;
