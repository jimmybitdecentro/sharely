import { useState, useCallback } from 'react';
import {
  SignupFormData,
  SignupFormErrors,
  SignupFormTouched,
  initialFormData,
  validateField,
  validateForm,
  hasErrors,
} from '../validations/signupSchema';

export interface UseSignupFormReturn {
  formData: SignupFormData;
  errors: SignupFormErrors;
  touched: SignupFormTouched;
  isSubmitting: boolean;
  isSubmitted: boolean;
  handleInputChange: (field: keyof SignupFormData, value: string) => void;
  handleBlur: (field: keyof SignupFormData) => void;
  handleSubmit: (onSubmit: (data: SignupFormData) => void | Promise<void>) => Promise<void>;
  resetForm: () => void;
  getFieldError: (field: keyof SignupFormData) => string | undefined;
  setFormValues: (values: Partial<SignupFormData>) => void;
}

export const useSignupForm = (): UseSignupFormReturn => {
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [touched, setTouched] = useState<SignupFormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Updates field value and clears its error
  const handleInputChange = useCallback(
    (field: keyof SignupFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors]
  );

  // Validates field on blur
  const handleBlur = useCallback(
    (field: keyof SignupFormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, formData[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [formData]
  );

  // Returns error only if field was touched or form submitted
  const getFieldError = useCallback(
    (field: keyof SignupFormData): string | undefined => {
      const shouldShowError = touched[field] || isSubmitted;
      return shouldShowError ? errors[field] || undefined : undefined;
    },
    [touched, isSubmitted, errors]
  );

  // Validates all fields and calls onSubmit if valid
  const handleSubmit = useCallback(
    async (onSubmit: (data: SignupFormData) => void | Promise<void>) => {
      setIsSubmitted(true);

      const validationErrors = validateForm(formData);
      setErrors(validationErrors);

      const allTouched: SignupFormTouched = {};
      (Object.keys(formData) as Array<keyof SignupFormData>).forEach((field) => {
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
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  }, []);

  const setFormValues = useCallback((values: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...values }));
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
    setFormValues,
  };
};

export default useSignupForm;
