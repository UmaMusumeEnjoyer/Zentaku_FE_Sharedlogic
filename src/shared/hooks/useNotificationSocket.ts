// shared-logic/src/shared/hooks/useNotificationSocket.ts

/**
 * useNotificationSocket Hook
 *
 * Bridge between Socket.IO notification events and the Zustand notification store.
 * Call this hook once at the app root level to listen for realtime notification events.
 *
 * Usage (in Web or Mobile):
 * ```tsx
 * function App() {
 *   useNotificationSocket();
 *   return <AppContent />;
 * }
 * ```
 */

import { useEffect, useRef } from 'react';
import { socketService } from '../../services/socket.service';
import { useNotificationStore } from './useNotificationStore';
import type { NotificationItem } from '../types/notification.types';

/**
 * Callback type for handling new notification events.
 * Used to trigger platform-specific UI (toast on web, push on mobile).
 */
export type OnNewNotificationCallback = (notification: NotificationItem) => void;

interface UseNotificationSocketOptions {
  /** Optional callback invoked when a new notification arrives */
  onNewNotification?: OnNewNotificationCallback;
}

export function useNotificationSocket(options?: UseNotificationSocketOptions) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount);
  const callbackRef = useRef(options?.onNewNotification);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = options?.onNewNotification;
  }, [options?.onNewNotification]);

  useEffect(() => {
    // Fetch initial notifications on mount
    fetchNotifications();
    fetchUnreadCount();

    // Listen for realtime notification events
    const unsubscribe = socketService.on('notification.new', (data: NotificationItem) => {
      addNotification(data);

      // Invoke platform-specific callback (e.g., show toast)
      if (callbackRef.current) {
        callbackRef.current(data);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [addNotification, fetchNotifications, fetchUnreadCount]);
}
