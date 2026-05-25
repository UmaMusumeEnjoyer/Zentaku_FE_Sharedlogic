export interface ActivityMetadata {
  title?: string;
  list_name?: string;
  [key: string]: any;
}

export interface ActivityItem {
  id: number | string;
  action_type: 'followed_anime' | 'create_list' | 'updated_followed_anime' | string;
  target_id: number | string;
  ago_seconds: number;
  metadata?: ActivityMetadata;
  created_at?: string; 
}

export interface ActivityFeedProps {
  userId?: string | number;
  filterDate?: string; // Format: YYYY-MM-DD
  username: string;
}