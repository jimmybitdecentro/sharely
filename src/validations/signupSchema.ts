import { validators } from '../services/validation/formValidation';

export interface SignupFormData {
  fullName: string;
  occupation: string;
  interests: string;
  age: string;
  gender: string;
  country: string;
  city: string;
}

export type SignupFormErrors = {
  [K in keyof SignupFormData]?: string | null;
};

export type SignupFormTouched = {
  [K in keyof SignupFormData]?: boolean;
};

export const initialFormData: SignupFormData = {
  fullName: '',
  occupation: '',
  interests: '',
  age: '',
  gender: '',
  country: '',
  city: '',
};

const VALIDATION_RULES = {
  fullName: { minLength: 2, maxLength: 50 },
} as const;

// Field validation functions
export const validateFullName = (value: string): string | null => {
  if (!validators.required(value)) return 'Full name is required';
  if (!validators.minLength(value.trim(), VALIDATION_RULES.fullName.minLength)) {
    return `Name must be at least ${VALIDATION_RULES.fullName.minLength} characters`;
  }
  if (!validators.maxLength(value.trim(), VALIDATION_RULES.fullName.maxLength)) {
    return `Name must be less than ${VALIDATION_RULES.fullName.maxLength} characters`;
  }
  return null;
};

export const validateOccupation = (value: string): string | null => {
  return !validators.required(value) ? 'Please select your occupation' : null;
};

export const validateInterests = (value: string): string | null => {
  return !validators.required(value) ? 'Please select your interests' : null;
};

export const validateAge = (value: string): string | null => {
  return !validators.required(value) ? 'Please select your age' : null;
};

export const validateGender = (value: string): string | null => {
  return !validators.required(value) ? 'Please select your gender' : null;
};

export const validateCountry = (value: string): string | null => {
  return !validators.required(value) ? 'Please select your country' : null;
};

export const validateCity = (value: string): string | null => {
  return !validators.required(value) ? 'Please select your city' : null;
};

export const fieldValidators: Record<keyof SignupFormData, (value: string) => string | null> = {
  fullName: validateFullName,
  occupation: validateOccupation,
  interests: validateInterests,
  age: validateAge,
  gender: validateGender,
  country: validateCountry,
  city: validateCity,
};

// Validates a single field by name
export const validateField = (fieldName: keyof SignupFormData, value: string): string | null => {
  const validator = fieldValidators[fieldName];
  return validator ? validator(value) : null;
};

// Validates entire form, returns object with errors for each invalid field
export const validateForm = (formData: SignupFormData): SignupFormErrors => {
  const errors: SignupFormErrors = {};
  (Object.keys(formData) as Array<keyof SignupFormData>).forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) errors[field] = error;
  });
  return errors;
};

// Checks if form has any errors
export const hasErrors = (errors: SignupFormErrors): boolean => {
  return Object.values(errors).some((error) => error !== null && error !== undefined);
};
