import { apiClient } from '../api/apiClient';
export const authService = {
    login: (credentials) => {
        return apiClient.post('/auth/login/', credentials);
    },
    register: (userData) => {
        return apiClient.post('/auth/register/', userData);
    },
    verifyEmail: (token) => {
        return apiClient.get(`/auth/verify-email/?token=${token}`);
    }
};
//# sourceMappingURL=auth.service.js.map