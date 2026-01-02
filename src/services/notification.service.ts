// shared-logic/src/services/notification.service.ts
import { apiClient } from '../api/apiClient';
import { NotificationListResponse, GetNotificationsParams } from '../shared/types/notification.types';

export const notificationService = {
  getPreferences: () => apiClient.get('/notification/preferences/'),
  
  updatePreferences: (data: any) => apiClient.put('/notification/preferences/', data),
  
  getMyNotifications: (params: GetNotificationsParams = {}) => 
    apiClient.get<NotificationListResponse>('/notification/my/', { params }),
};