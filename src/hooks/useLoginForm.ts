import { useState, useCallback } from 'react';
import {
  LoginFormData,
  LoginFormErrors,
  LoginFormTouched,
  initialLoginFormData,
  validateField,
  validateLoginForm,
  hasErrors,
} from '../validations/loginSchema';

export interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: LoginFormErrors;
  touched: LoginFormTouched;
  isSubmitting: boolean;
  isSubmitted: boolean;
  handleInputChange: (field: keyof LoginFormData, value: string) => void;
  handleBlur: (field: keyof LoginFormData) => void;
  handleSubmit: (onSubmit: (data: LoginFormData) => void | Promise<void>) => Promise<void>;
  resetForm: () => void;
  getFieldError: (field: keyof LoginFormData) => string | undefined;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const [formData, setFormData] = useState<LoginFormData>(initialLoginFormData);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<LoginFormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof LoginFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (field: keyof LoginFormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, formData[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [formData]
  );

  const getFieldError = useCallback(
    (field: keyof LoginFormData): string | undefined => {
      const shouldShowError = touched[field] || isSubmitted;
      return shouldShowError ? errors[field] || undefined : undefined;
    },
    [touched, isSubmitted, errors]
  );

  const handleSubmit = useCallback(
    async (onSubmit: (data: LoginFormData) => void | Promise<void>) => {
      setIsSubmitted(true);

      const validationErrors = validateLoginForm(formData);
      setErrors(validationErrors);

      const allTouched: LoginFormTouched = {};
      (Object.keys(formData) as Array<keyof LoginFormData>).forEach((field) => {
        allTouched[field] = true;
      });
      setTouched(allTouched);

      if (hasErrors(validationErrors)) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const resetForm = useCallback(() => {
    setFormData(initialLoginFormData);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    isSubmitted,
    handleInputChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldError,
  };
};

export default useLoginForm;

