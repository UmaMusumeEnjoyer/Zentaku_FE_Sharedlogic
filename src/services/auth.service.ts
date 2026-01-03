// shared-logic/src/services/auth.service.ts
import { apiClient } from '../api/apiClient';
import { LoginCredentials, LoginResponse, RegisterData } from '../features/authPage/auth.types';

export const authService = {
  login: (credentials: LoginCredentials) => {
    return apiClient.post<LoginResponse>('/auth/login/', credentials);
  },

  register: (userData: RegisterData) => {
    return apiClient.post('/auth/register/', userData);
  },

  verifyEmail: (token: string) => {
    return apiClient.get(`/auth/verify-email/?token=${token}`);
  },

  // Thêm API refresh token
  refreshToken: (refreshToken: string) => {
    return apiClient.post<{ access: string; refresh: string }>('/auth/token/refresh/', {
      refresh: refreshToken
    });
  }
};