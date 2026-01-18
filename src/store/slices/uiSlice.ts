import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast message
export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// UI State
export interface UIState {
  isGlobalLoading: boolean;
  globalLoadingText: string | null;
  toast: ToastMessage | null;
}

const initialState: UIState = {
  isGlobalLoading: false,
  globalLoadingText: null,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Global loading
    setGlobalLoading: (
      state,
      action: PayloadAction<{isLoading: boolean; text?: string}>,
    ) => {
      state.isGlobalLoading = action.payload.isLoading;
      state.globalLoadingText = action.payload.text || null;
    },

    // Show toast
    showToast: (
      state,
      action: PayloadAction<Omit<ToastMessage, 'id'>>,
    ) => {
      state.toast = {
        ...action.payload,
        id: Date.now().toString(),
      };
    },

    // Hide toast
    hideToast: (state) => {
      state.toast = null;
    },

    // Show success toast
    showSuccessToast: (
      state,
      action: PayloadAction<{title: string; message?: string}>,
    ) => {
      state.toast = {
        id: Date.now().toString(),
        type: 'success',
        title: action.payload.title,
        message: action.payload.message,
      };
    },

    // Show error toast
    showErrorToast: (
      state,
      action: PayloadAction<{title: string; message?: string}>,
    ) => {
      state.toast = {
        id: Date.now().toString(),
        type: 'error',
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export const {
  setGlobalLoading,
  showToast,
  hideToast,
  showSuccessToast,
  showErrorToast,
} = uiSlice.actions;

export default uiSlice.reducer;
