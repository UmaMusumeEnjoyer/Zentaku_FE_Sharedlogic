// shared-logic/src/shared/types/notification.types.ts

/**
 * Notification type enum matching backend NotificationType
 */
export enum NotificationType {
  MESSAGE = 'message',
  ANIME_AIRING = 'anime_airing',
  LIST_INTERACTION = 'list_interaction',
  NEW_FOLLOWER = 'new_follower',
}

/**
 * Metadata for message notifications
 */
export interface MessageNotificationMetadata {
  channelId?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string | null;
  messagePreview?: string;
}

/**
 * Metadata for anime airing notifications
 */
export interface AnimeAiringNotificationMetadata {
  animeId?: number;
  animeName?: string;
  episodeNumber?: number;
  airingAt?: string;
  coverImage?: string | null;
}

/**
 * Metadata for list interaction notifications
 */
export interface ListInteractionNotificationMetadata {
  listId?: string | number;
  listBanner?: string | null;
  actorAvatar?: string | null;
}

/**
 * Metadata for new follower notifications
 */
export interface FollowerNotificationMetadata {
  followerId?: string;
  followerName?: string;
  followerUsername?: string;
  followerAvatar?: string | null;
}

/**
 * Combined notification metadata type
 */
export type NotificationMetadata = MessageNotificationMetadata &
  AnimeAiringNotificationMetadata &
  ListInteractionNotificationMetadata &
  FollowerNotificationMetadata &
  Record<string, unknown>;

/**
 * Individual notification item from the server
 */
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  metadata?: NotificationMetadata | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

/**
 * Pagination info for notification list
 */
export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Response from GET /api/notifications
 */
export interface NotificationListResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  pagination: NotificationPagination;
}

/**
 * Response from GET /api/notifications/unread-count
 */
export interface UnreadCountResponse {
  unreadCount: number;
}

/**
 * Params for fetching notifications
 */
export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}