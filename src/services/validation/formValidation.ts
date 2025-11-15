export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  },

  required: (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value.trim().length > 0;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  password: (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },
};

export const validateEmail = (email: string): string | null => {
  if (!validators.required(email)) {
    return 'Email is required';
  }
  if (!validators.email(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!validators.required(password)) {
    return 'Password is required';
  }
  if (!validators.minLength(password, 8)) {
    return 'Password must be at least 8 characters';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!validators.required(phone)) {
    return 'Phone number is required';
  }
  if (!validators.phone(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

