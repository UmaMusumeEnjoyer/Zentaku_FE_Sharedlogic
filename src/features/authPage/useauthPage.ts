// src/features/authPage/useauthPage.ts
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { RegisterData } from './auth.types';

export interface UseAuthPageReturn {
  isActive: boolean;
  isLoading: boolean; // 1. Thêm kiểu dữ liệu cho isLoading
  registerData: RegisterData & { confirm_password: string };
  loginData: { email: string; password: string };
  handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
  handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
  handleRegisterClick: () => void;
  handleLoginClick: () => void;
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
  initialPath?: 'login' | 'signup',
  verificationToken?: string | null
): UseAuthPageReturn => {
  const [isActive, setIsActive] = useState(initialPath === 'signup');
  const [isLoading, setIsLoading] = useState(false); // 2. Khởi tạo state isLoading

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
  
  // Email verification logic on mount (Giữ nguyên)
  useEffect(() => {
    const verifyToken = async () => {
      if (verificationToken) {
        setIsLoading(true); // Có thể thêm loading khi verify
        try {
          await authService.verifyEmail(verificationToken);
          callbacks.onVerifySuccess("Email verified successfully! Please login.");
          callbacks.onNavigateToLogin();
        } catch (error: any) {
          const errorMsg = error.response?.data?.error || "Verification failed.";
          callbacks.onVerifyError(errorMsg);
          callbacks.onNavigateToLogin();
        } finally {
            setIsLoading(false);
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

    setIsLoading(true); // 3. Bật loading

    try {
      const response = await authService.register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirm_password,
      });
      callbacks.onRegisterSuccess(response.data.message || 'Registration successful!');
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
      setIsLoading(false); // 4. Tắt loading
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true); // 5. Bật loading

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
        setIsLoading(false); // 6. Tắt loading
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
    isLoading, // 7. Return isLoading
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