// Base API Response Types

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: Pagination;
}

export interface PaginatedResponse<T> {
  success: true;
  data: PaginatedData<T>;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Health Check
export interface HealthResponse {
  status: string;
  timestamp: string;
}

// API Error for handling
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
