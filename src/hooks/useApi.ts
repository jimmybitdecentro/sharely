import {useState, useCallback} from 'react';
import {ApiResponse} from '../types/api';
import {getErrorMessage} from '../services/api/apiClient';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useApi = <T = any>(
  apiCall: () => Promise<ApiResponse<T>>,
  options?: UseApiOptions<T>,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (response.success) {
        setData(response.data);
        options?.onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || 'An error occurred';
        setError(errorMessage);
        options?.onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
};

