import { validators } from '../services/validation/formValidation';

export interface LoginFormData {
  email: string;
  referral: string;
}

export type LoginFormErrors = {
  [K in keyof LoginFormData]?: string | null;
};

export type LoginFormTouched = {
  [K in keyof LoginFormData]?: boolean;
};

export const initialLoginFormData: LoginFormData = {
  email: '',
  referral: '',
};

export const validateEmail = (value: string): string | null => {
  if (!validators.required(value)) return 'Email is required';
  if (!validators.email(value)) return 'Please enter a valid email';
  return null;
};

// Referral is optional, so no validation needed
export const validateReferral = (_value: string): string | null => {
  return null;
};

export const fieldValidators: Record<keyof LoginFormData, (value: string) => string | null> = {
  email: validateEmail,
  referral: validateReferral,
};

export const validateField = (fieldName: keyof LoginFormData, value: string): string | null => {
  const validator = fieldValidators[fieldName];
  return validator ? validator(value) : null;
};

export const validateLoginForm = (formData: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};
  
  // Only validate required fields
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  return errors;
};

export const hasErrors = (errors: LoginFormErrors): boolean => {
  return Object.values(errors).some((error) => error !== null && error !== undefined);
};

