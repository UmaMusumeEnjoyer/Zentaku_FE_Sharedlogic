import { apiClient } from '../core/apiClient';
export const notificationService = {
    getPreferences: () => apiClient.get('/notification/preferences/'),
    updatePreferences: (data) => apiClient.put('/notification/preferences/', data),
    getMyNotifications: (params = {}) => apiClient.get('/notification/my/', { params }),
};
//# sourceMappingURL=notification.service.js.map