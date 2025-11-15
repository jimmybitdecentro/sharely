import {AxiosError} from 'axios';
import {ApiError} from '../../types/api';

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
      return {
        message: data?.message || error.message || 'An error occurred',
        statusCode: error.response.status,
        errors: data?.errors,
      };
    } else if (error.request) {
      // Request made but no response
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

