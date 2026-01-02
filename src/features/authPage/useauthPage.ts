// src/features/authPage/useauthPage.ts
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { RegisterData } from './auth.types';

export interface UseAuthPageReturn {
  isActive: boolean;
  registerData: RegisterData & { confirm_password: string };
  loginData: { email: string; password: string };
  handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  handleRegisterClick: () => void;
  handleLoginClick: () => void;
}

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
  initialPath?: 'login' | 'signup',
  verificationToken?: string | null
): UseAuthPageReturn => {
  const [isActive, setIsActive] = useState(initialPath === 'signup');

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

  // Email verification logic on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (verificationToken) {
        try {
          await authService.verifyEmail(verificationToken);
          callbacks.onVerifySuccess("Email verified successfully! Please login.");
          callbacks.onNavigateToLogin();
        } catch (error: any) {
          const errorMsg = error.response?.data?.error || "Verification failed.";
          callbacks.onVerifyError(errorMsg);
          callbacks.onNavigateToLogin();
        }
      }
    };
    verifyToken();
  }, [verificationToken]);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirm_password) {
      callbacks.onRegisterError("Passwords do not match!");
      return;
    }

    try {
      const { confirm_password, ...dataToSend } = registerData;
      const response = await authService.register(dataToSend);
      callbacks.onRegisterSuccess(response.data.message || 'Registration successful!');
      callbacks.onNavigateToLogin();
    } catch (error: any) {
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
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await callbacks.loginCallback(loginData.email, loginData.password);
    if (result.success) {
      callbacks.onLoginSuccess(result.message);
    } else {
      callbacks.onLoginError(result.message);
    }
  };

  const handleRegisterClick = () => {
    setIsActive(true);
    callbacks.onNavigateToSignup();
  };

  const handleLoginClick = () => {
    setIsActive(false);
    callbacks.onNavigateToLogin();
  };

  return {
    isActive,
    registerData,
    loginData,
    handleRegisterChange,
    handleLoginChange,
    handleRegisterSubmit,
    handleLoginSubmit,
    handleRegisterClick,
    handleLoginClick,
  };
};