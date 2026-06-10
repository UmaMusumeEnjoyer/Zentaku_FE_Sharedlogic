// src/features/authPage/useauthPage.ts
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { RegisterData, RegisterRequest } from './auth.types';
import {
  type ValidationErrors,
  validateLoginEmail,
  validateLoginPassword,
  validateLoginForm,
  validateRegisterUsername,
  validateRegisterEmail,
  validateRegisterPassword,
  validateRegisterConfirmPassword,
  validateRegisterForm,
  hasValidationErrors,
} from './authValidation';

export interface UseAuthPageReturn {
  isActive: boolean;
  isLoading: boolean;
  registerData: RegisterData & { confirm_password: string };
  loginData: { email: string; password: string };
  loginErrors: ValidationErrors;
  registerErrors: ValidationErrors;
  handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  handleRegisterClick: () => void;
  handleLoginClick: () => void;
  handleLoginBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleRegisterBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// ... (Giữ nguyên phần UseAuthPageCallbacks) ...
export interface UseAuthPageCallbacks {
  onLoginSuccess: (message: string) => void;
  onLoginError: (message: string) => void;
  onRegisterSuccess: (message: string) => void;
  onRegisterError: (message: string) => void;
  onVerifySuccess: (message: string) => void;
  onVerifyError: (message: string) => void;
  onNavigateToSignup: () => void;
  onNavigateToLogin: () => void;
  loginCallback: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
}

export const useAuthPage = (
  callbacks: UseAuthPageCallbacks,
  initialPath?: 'login' | 'signup'
): UseAuthPageReturn => {
  const [isActive, setIsActive] = useState(initialPath === 'signup');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsActive(initialPath === 'signup');
  }, [initialPath]);

  // ... (Giữ nguyên phần useState data và useEffect) ...
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Validation errors state
  const [loginErrors, setLoginErrors] = useState<ValidationErrors>({});
  const [registerErrors, setRegisterErrors] = useState<ValidationErrors>({});

  // ---- Change handlers: clear error for the field being edited ----
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setRegisterData({ ...registerData, [name]: e.target.value });
    // Clear error for this field as user starts typing
    if (registerErrors[name]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setLoginData({ ...loginData, [name]: e.target.value });
    // Clear error for this field as user starts typing
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ---- Blur handlers: validate individual field on blur ----
  const handleLoginBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error: string | null = null;

    switch (name) {
      case 'email':
        error = validateLoginEmail(value);
        break;
      case 'password':
        error = validateLoginPassword(value);
        break;
    }

    setLoginErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleRegisterBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error: string | null = null;

    switch (name) {
      case 'email':
        error = validateRegisterEmail(value);
        break;
      case 'username':
        error = validateRegisterUsername(value);
        break;
      case 'password':
        error = validateRegisterPassword(value);
        break;
      case 'confirm_password':
        error = validateRegisterConfirmPassword(registerData.password, value);
        break;
    }

    setRegisterErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ---- Submit handlers: validate full form before API call ----
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run full form validation
    const errors = validateRegisterForm(registerData);
    setRegisterErrors(errors);
    if (hasValidationErrors(errors)) {
      return; // Stop — don't call API
    }

    setIsLoading(true);

    try {
      const requestData: RegisterRequest = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirm_password,
      };
      const response = await authService.register(requestData);
      // Zentaku_BE response đã unwrap: response.data = { message: "..." }
      callbacks.onRegisterSuccess(response.data?.message || 'Registration successful!');
      
      // Clear form data
      setRegisterData({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
      });
      setRegisterErrors({});
      
      // Slide to login form
      setIsActive(false);
      
      callbacks.onNavigateToLogin();
    } catch (error: any) {
      // ... (Giữ nguyên logic xử lý lỗi) ...
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.details) {
          Object.values(errorData.details).forEach((messages: any) => {
            messages.forEach((msg: string) => callbacks.onRegisterError(msg));
          });
        } else if (errorData.error) {
          callbacks.onRegisterError(errorData.error);
        } else {
          callbacks.onRegisterError('An unexpected error occurred.');
        }
      } else {
        callbacks.onRegisterError('Unable to connect to the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run full form validation
    const errors = validateLoginForm(loginData);
    setLoginErrors(errors);
    if (hasValidationErrors(errors)) {
      return; // Stop — don't call API
    }
    
    setIsLoading(true);

    try {
        const result = await callbacks.loginCallback(loginData.email, loginData.password);
        if (result.success) {
            callbacks.onLoginSuccess(result.message);
        } else {
            callbacks.onLoginError(result.message);
        }
    } catch (error) {
        callbacks.onLoginError("Login failed unexpectedly.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    setIsActive(true);
    setLoginErrors({});  // Clear errors when switching forms
    callbacks.onNavigateToSignup();
  };

  const handleLoginClick = () => {
    setIsActive(false);
    setRegisterErrors({});  // Clear errors when switching forms
    callbacks.onNavigateToLogin();
  };

  return {
    isActive,
    isLoading,
    registerData,
    loginData,
    loginErrors,
    registerErrors,
    handleRegisterChange,
    handleLoginChange,
    handleRegisterSubmit,
    handleLoginSubmit,
    handleRegisterClick,
    handleLoginClick,
    handleLoginBlur,
    handleRegisterBlur,
  };
};