// shared-logic/src/shared/hooks/useNotificationStore.ts

/**
 * Notification Store (Zustand)
 *
 * Centralized state management for notifications.
 * Used by both Web and Mobile frontends.
 */

import { create } from 'zustand';
import { notificationService } from '../../services/notification.service';
import type { NotificationItem } from '../types/notification.types';

interface NotificationState {
  /** List of notification items (most recent first) */
  notifications: NotificationItem[];
  /** Total count of unread notifications */
  unreadCount: number;
  /** Whether a fetch operation is in progress */
  isLoading: boolean;
  /** Current pagination page */
  currentPage: number;
  /** Whether there are more pages to load */
  hasMore: boolean;

  // ============ Actions ============

  /** Fetch notifications from the server (page 1, replaces current list) */
  fetchNotifications: () => Promise<void>;
  /** Load more notifications (next page, appends to current list) */
  loadMore: () => Promise<void>;
  /** Fetch unread count from the server */
  fetchUnreadCount: () => Promise<void>;
  /** Add a new notification from socket (prepend to list, increment unread) */
  addNotification: (notification: NotificationItem) => void;
  /** Mark a single notification as read (optimistic update + server call) */
  markAsRead: (notificationId: string) => Promise<void>;
  /** Mark all notifications as read (optimistic update + server call) */
  markAllAsRead: () => Promise<void>;
  /** Reset the store (e.g., on logout) */
  reset: () => void;
}

const initialState = {
  notifications: [] as NotificationItem[],
  unreadCount: 0,
  isLoading: false,
  currentPage: 1,
  hasMore: true,
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  ...initialState,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await notificationService.getNotifications({ page: 1, limit: 20 });
      const data = response.data?.data;
      if (data) {
        set({
          notifications: data.notifications,
          unreadCount: data.unreadCount,
          currentPage: 1,
          hasMore: data.pagination.page < data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error('[NotificationStore] Failed to fetch notifications:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { currentPage, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true });
    try {
      const nextPage = currentPage + 1;
      const response = await notificationService.getNotifications({
        page: nextPage,
        limit: 20,
      });
      const data = response.data?.data;
      if (data) {
        set((state) => ({
          notifications: [...state.notifications, ...data.notifications],
          unreadCount: data.unreadCount,
          currentPage: nextPage,
          hasMore: nextPage < data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('[NotificationStore] Failed to load more notifications:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationService.getUnreadCount();
      const data = response.data?.data;
      if (data) {
        set({ unreadCount: data.unreadCount });
      }
    } catch (error) {
      console.error('[NotificationStore] Failed to fetch unread count:', error);
    }
  },

  addNotification: (notification: NotificationItem) => {
    set((state) => {
      // Deduplicate by ID
      if (state.notifications.some((n) => String(n.id) === String(notification.id))) {
        return state;
      }
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
      };
    });
  },

  markAsRead: async (notificationId: string) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(
        0,
        state.unreadCount -
          (state.notifications.find((n) => n.id === notificationId && !n.isRead) ? 1 : 0)
      ),
    }));

    try {
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.error('[NotificationStore] Failed to mark as read:', error);
      // Revert on failure: refetch
      get().fetchNotifications();
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date().toISOString(),
      })),
      unreadCount: 0,
    }));

    try {
      await notificationService.markAllAsRead();
    } catch (error) {
      console.error('[NotificationStore] Failed to mark all as read:', error);
      get().fetchNotifications();
    }
  },

  reset: () => {
    set(initialState);
  },
}));
