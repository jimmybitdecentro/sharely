import Toast from 'react-native-toast-message';

// Toast configuration types
type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

// Show success toast
export const showSuccess = (options: ToastOptions | string) => {
  const opts = typeof options === 'string' ? {title: options} : options;
  Toast.show({
    type: 'success',
    text1: opts.title,
    text2: opts.message,
    visibilityTime: opts.duration || 3000,
    position: opts.position || 'top',
  });
};

// Show error toast
export const showError = (options: ToastOptions | string) => {
  const opts = typeof options === 'string' ? {title: options} : options;
  Toast.show({
    type: 'error',
    text1: opts.title,
    text2: opts.message,
    visibilityTime: opts.duration || 4000,
    position: opts.position || 'top',
  });
};

// Show info toast
export const showInfo = (options: ToastOptions | string) => {
  const opts = typeof options === 'string' ? {title: options} : options;
  Toast.show({
    type: 'info',
    text1: opts.title,
    text2: opts.message,
    visibilityTime: opts.duration || 3000,
    position: opts.position || 'top',
  });
};

// Hide toast
export const hideToast = () => {
  Toast.hide();
};

// Toast utility object for convenience
export const toast = {
  success: showSuccess,
  error: showError,
  info: showInfo,
  hide: hideToast,
};

export default toast;

