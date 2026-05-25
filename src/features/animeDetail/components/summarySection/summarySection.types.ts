export interface Anime {
  id: number | string;
  // camelCase (Zentaku_BE format)
  coverImage?: { large?: string } | string;
  title?: { romaji?: string };
  description?: string;

  // snake_case (Old format)
  cover_image?: string;
  name_romaji?: string;
  desc?: string; // HTML string
}

export interface UserStatusData {
  watch_status: 'watching' | 'plan_to_watch' | 'completed' | 'dropped' | 'on_hold';
  score?: number;
  progress?: number;
  is_following?: boolean;
  anime?: number | string;
  [key: string]: any; // Cho các trường mở rộng khác
}

export interface SummarySectionProps {
  anime: Anime;
  hasBanner?: boolean;
}