// src/components/InfoSidebar/types.ts

export interface NextAiringEpisode {
  episode: number;
  timeUntilAiring: number;
}

export interface AnimeInfo {
  // camelCase (Zentaku_BE format)
  format?: string;
  episodes?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  seasonYear?: number;
  score?: number;
  meanScore?: number;
  title?: {
    native?: string;
    english?: string;
  };
  nextAiringEpisode?: NextAiringEpisode;

  // snake_case (Old format)
  next_airing_ep?: NextAiringEpisode;
  airing_format?: string;
  airing_episodes?: number;
  duration?: number;
  airing_status?: string;
  starting_time?: string;
  ending_time?: string;
  season?: string;
  season_year?: number;
  average_score?: number;
  mean_score?: number;
  popularity?: number;
  favourites?: number;
  studios?: string[];
  producers?: string[];
  source?: string;
  name_native?: string;
  name_english?: string;
}

export interface InfoSidebarProps {
  anime: AnimeInfo;
}

export interface InfoBlockProps {
  label: string;
  value: string | number | null | undefined;
  isAiring?: boolean;
}

export interface InfoListBlockProps {
  label: string;
  items?: string[];
}