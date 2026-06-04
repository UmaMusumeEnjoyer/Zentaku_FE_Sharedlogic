// shared-logic/src/services/notification.service.ts

/**
 * Notification Service
 *
 * Provides REST API access to notification endpoints on Zentaku_BE.
 * Replaces the deprecated mock implementation.
 */

import { apiClient } from '../api/apiClient';
import type {
  NotificationListResponse,
  UnreadCountResponse,
  GetNotificationsParams,
} from '../shared/types/notification.types';

export const notificationService = {
  /**
   * Get paginated notifications for the authenticated user.
   * GET /notifications
   */
  getNotifications: (params: GetNotificationsParams = {}) => {
    const { page = 1, limit = 20 } = params;
    return apiClient.get<{ success: boolean; data: NotificationListResponse }>(
      '/notifications',
      { params: { page, limit } }
    );
  },

  /**
   * Get unread notification count.
   * GET /notifications/unread-count
   */
  getUnreadCount: () => {
    return apiClient.get<{ success: boolean; data: UnreadCountResponse }>(
      '/notifications/unread-count'
    );
  },

  /**
   * Mark a single notification as read.
   * PATCH /notifications/:id/read
   */
  markAsRead: (notificationId: string) => {
    return apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read.
   * PATCH /notifications/read-all
   */
  markAllAsRead: () => {
    return apiClient.patch('/notifications/read-all');
  },
};