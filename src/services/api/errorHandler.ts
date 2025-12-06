import {AxiosError} from 'axios';
import {ApiError} from '../../types/api.types';

export class ApiException extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiException) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      errors: error.errors,
    };
  }

  if (error instanceof AxiosError) {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      
      // Handle API error format: { success: false, error: { message, statusCode } }
      if (data?.error?.message) {
        return {
          message: data.error.message,
          statusCode: data.error.statusCode || error.response.status,
          errors: data.errors,
        };
      }
      
      return {
        message: data?.message || error.message || 'An error occurred',
        statusCode: error.response.status,
        errors: data?.errors,
      };
    } else if (error.request) {
      // Request made but no response
      if (error.code === 'ECONNABORTED') {
        return {
          message: 'Request timeout. Please try again.',
          statusCode: 408,
        };
      }
      return {
        message: 'Network error. Please check your connection.',
        statusCode: undefined,
      };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};

// Helper to check if error is a specific status code
export const isStatusError = (error: unknown, status: number): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === status;
  }
  return false;
};

// Helper to check if error is network error
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && !!error.request;
  }
  return false;
};

// Helper to check if error is unauthorized
export const isUnauthorizedError = (error: unknown): boolean => {
  return isStatusError(error, 401);
};

// Helper to check if error is rate limited
export const isRateLimitError = (error: unknown): boolean => {
  return isStatusError(error, 429);
};
