import { apiClient } from '../core/apiClient';

export const authService = {
  login: (credentials: any) => {
    return apiClient.post('/auth/login/', credentials);
  },

  register: (userData: any) => {
    return apiClient.post('/auth/register/', userData);
  },

  verifyEmail: (token: string) => {
    return apiClient.get(`/auth/verify-email/?token=${token}`);
  }
};