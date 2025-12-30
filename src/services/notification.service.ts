import { apiClient } from '../api/apiClient';

export const notificationService = {
  getPreferences: () => apiClient.get('/notification/preferences/'),
  
  updatePreferences: (data: any) => apiClient.put('/notification/preferences/', data),
  
  getMyNotifications: (params = {}) => apiClient.get('/notification/my/', { params }),
};