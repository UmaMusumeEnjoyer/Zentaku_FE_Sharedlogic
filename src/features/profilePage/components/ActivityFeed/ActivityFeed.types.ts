export interface ActivityMetadata {
  action?: string;
  targetId?: string | number;
  mediaType?: string;
  targetName?: string;
  targetType?: string;
  targetImage?: string;
  list_name?: string;
  [key: string]: any;
}

export interface ActivityItem {
  id: number | string;
  createdAt: string;
  userId: string | number;
  type: string;
  metaData?: ActivityMetadata;
  mediaId?: string | number;
  media?: any;
}

export interface ActivityFeedProps {
  userId?: string | number;
  filterDate?: string; // Format: YYYY-MM-DD
  username: string;
}