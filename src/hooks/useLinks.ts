import {useState, useCallback} from 'react';
import {
  useGetMyLinksQuery,
  useCreateAdvertisementLinkMutation,
} from '../store/api';
import {useAppDispatch} from '../store/hooks';
import {showSuccessToast, showErrorToast} from '../store/slices/uiSlice';

interface UseLinksOptions {
  initialPage?: number;
  initialLimit?: number;
}

export const useLinks = (options: UseLinksOptions = {}) => {
  const {
    initialPage = 1,
    initialLimit = 20,
  } = options;

  const dispatch = useAppDispatch();

  // Pagination state
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  // Query params
  const queryParams = {page, limit};

  // RTK Query hook
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMyLinksQuery(queryParams);

  // Create link mutation
  const [createLink, {isLoading: isCreatingLink}] = useCreateAdvertisementLinkMutation();

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

  // Reset pagination
  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  // Create advertisement link
  const handleCreateLink = useCallback(
    async (advertisementId: string) => {
      try {
        const result = await createLink(advertisementId).unwrap();
        dispatch(showSuccessToast({
          title: 'Link Created',
          message: 'Your share link has been created',
        }));
        return {success: true, data: result};
      } catch (err: any) {
        const errorMessage = err?.data?.error?.message || 'Failed to create link';
        dispatch(showErrorToast({title: 'Error', message: errorMessage}));
        return {success: false, error: errorMessage};
      }
    },
    [createLink, dispatch],
  );

  return {
    // Data
    links: data?.links || [],
    pagination: data?.pagination || null,
    
    // Loading states
    isLoading,
    isFetching,
    isCreatingLink,
    
    // Error
    error: error ? 'Failed to load links' : null,
    
    // Pagination controls
    page,
    hasNextPage: data?.pagination ? page < data.pagination.totalPages : false,
    hasPreviousPage: page > 1,
    loadNextPage,
    loadPreviousPage,
    resetPagination,
    
    // Actions
    refetch,
    createLink: handleCreateLink,
  };
};

export default useLinks;

