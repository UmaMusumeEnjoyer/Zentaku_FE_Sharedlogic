// Types cho AddAnimeModal
export interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnime: (anime: AnimeItem_addAnimeModal) => Promise<void>;
  currentList?: AnimeItem_addAnimeModal[];
  listId?: string; // Để fetch recommendations
}

export interface AnimeItem_addAnimeModal {
  id?: number | string;
  anilist_id?: number | string;
  title_romaji?: string;
  name_romaji?: string;
  name_native?: string;
  name_english?: string;
  title_english?: string;
  cover_image?: string;
  coverImage?: {
    large?: string;
  };
  episodes?: number;
  airing_episodes?: number;
  average_score?: number;
  averageScore?: number;
  season?: string;
  episode_progress?: number;
  next_airing_ep?: {
    episode: number;
    timeUntilAiring: number;
  };
  media?: any;
  romaji?: string;
  title?: {
    english?: string;
    romaji?: string;
  };
  cover?: string;
}

export interface RecommendedAnime {
  idAnilist: number;
  title: {
    romaji: string;
    english?: string;
  };
  coverImage: string;
  score: number;
  genres: string[];
  episodes?: number;
  relevanceScore: number;
  recommendedBy: string[];
}

export interface UserAnimeData {
  recommended?: AnimeItem_addAnimeModal[]; // Map RecommendedAnime về dạng component cần
  watching?: AnimeItem_addAnimeModal[];
  completed?: AnimeItem_addAnimeModal[];
  on_hold?: AnimeItem_addAnimeModal[];
  dropped?: AnimeItem_addAnimeModal[];
  plan_to_watch?: AnimeItem_addAnimeModal[];
}

export type AnimeStatusKey = 'recommended' | 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';