// shared-logic/src/services/auth.service.ts
import { apiClient } from '../api/apiClient';
import { LoginCredentials, LoginResponse, RegisterData } from '../features/authPage/auth.types';

type RegisterRequest = RegisterData & {
  confirmPassword: string;
};

export const authService = {
  login: (credentials: LoginCredentials) => {
    return apiClient.post<LoginResponse>('/auth/login/', credentials);
  },

  register: (userData: RegisterRequest) => {
    return apiClient.post('/auth/register/', userData);
  },

  verifyEmail: (token: string) => {
    return apiClient.get(`/auth/verify-email/?token=${token}`);
  },

  refreshToken: () => {
    return apiClient.post<{ accessToken: string; expiresIn: number }>('/auth/refresh-token', {});
  }
};