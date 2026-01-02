// shared-logic/src/shared/types/notification.types.ts
export interface Notification {
  notification_id: number;
  anilist_id: number;
  anime_title?: string;
  episode_number: number;
  airing_at: string;
  sent_at: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface NotificationListResponse {
  count: number;
  notifications: Notification[];
}

export interface GetNotificationsParams {
  status?: 'pending' | 'sent' | 'failed';
  limit?: number;
}