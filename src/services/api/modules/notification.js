import { axiosInstance } from '../core';

/**
 * Lấy cấu hình thông báo hiện tại
 * Endpoint: GET /api/notification/preferences/
 */
export const getNotificationPreferences = () => {
  return axiosInstance.get('/notification/preferences/');
};

/**
 * Cập nhật cấu hình thông báo
 * Endpoint: PUT /api/notification/preferences/ (hoặc POST tùy backend)
 * Body mẫu:
 * {
 * "notify_before_hours": 48,
 * "enabled": true,
 * "notify_by_email": true,
 * "notify_in_app": false
 * }
 */
export const updateNotificationPreferences = (data) => {
  return axiosInstance.put('/notification/preferences/', data);
};

/**
 * Lấy danh sách thông báo của tôi
 * Endpoint: GET /api/notification/my/?status=pending&limit=20
 * Param mẫu: { status: 'pending', limit: 20 }
 */
export const getUserNotifications = (params = {}) => {
  // params sẽ tự động được axios chuyển thành query string (?key=value)
  return axiosInstance.get('/notification/my/', { params });
};