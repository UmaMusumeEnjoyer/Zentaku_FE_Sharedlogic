// shared-logic/src/services/notification.service.ts
import { userService } from './user.service';
import { NotificationListResponse, GetNotificationsParams } from '../shared/types/notification.types';

// ====================================================================
// NOTIFICATION SERVICE - DEPRECATED in Zentaku_BE
// Các endpoint `/api/notification/*` đã bị gỡ bỏ.
// Tính năng cài đặt thông báo được tích hợp vào `userService.updatePreferences`.
// File này cung cấp adapter để đảm bảo backward compatibility cho các hook/components cũ.
// ====================================================================

export const notificationService = {
  getPreferences: async () => {
    console.warn("⚠️ notificationService.getPreferences is mapped to userService.getMyProfile in Zentaku_BE.");
    try {
      const res = await userService.getMyProfile();
      // Lấy từ preferences của profile nếu có, hoặc dùng mock fallback
      const notifSettings = (res.data as any)?.notificationSettings || {};
      
      return {
        data: {
          notify_before_hours: 24, // Legacy fallback
          enabled: true,
          notify_by_email: notifSettings.email ?? true,
          notify_in_app: notifSettings.push ?? true
        }
      };
    } catch (error) {
      console.error("Failed to fetch user profile for notification preferences", error);
      return {
        data: {
          notify_before_hours: 24,
          enabled: true,
          notify_by_email: true,
          notify_in_app: true
        }
      };
    }
  },
  
  updatePreferences: (data: any) => {
    console.warn("⚠️ notificationService.updatePreferences is mapped to userService.updatePreferences in Zentaku_BE.");
    // Ánh xạ từ cấu trúc cũ sang cấu trúc Zentaku_BE UserPreferences
    const payload = {
      notificationSettings: {
        email: data.notify_by_email,
        push: data.notify_in_app,
        follows: true, // Defaults for missing old fields
        comments: true,
        listUpdates: true
      }
    };
    return userService.updatePreferences(payload);
  },
  
  getMyNotifications: (_params: GetNotificationsParams = {}): Promise<{ data: NotificationListResponse }> => {
    console.warn("⚠️ notificationService.getMyNotifications is removed in Zentaku_BE. Returning empty list.");
    return Promise.resolve({
      data: {
        count: 0,
        unreadCount: 0,
        notifications: [],
        pagination: {
          page: 1,
          per_page: 20,
          total: 0,
          total_pages: 0
        }
      } as any // Use as any to prevent strict type mismatches with old interfaces if they differ slightly
    });
  },
};