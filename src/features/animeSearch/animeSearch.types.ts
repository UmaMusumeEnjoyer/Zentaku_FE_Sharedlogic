// Định nghĩa bộ lọc
export interface AnimeFilters {
  genre?: string;
  year?: string | number;
  season?: string;
  format?: string;
  status?: string;
  sort?: string;
}

// Định nghĩa cấu trúc Anime sau khi đã map dữ liệu (Zentaku_BE camelCase)
export interface AnimeData_animeSearch {
  id: number | string;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    large: string;
    extraLarge?: string;
    medium?: string;
  };
  episodes?: number;
  averageScore?: number | null;
  popularity?: number;
  season?: string | null;
  nextAiringEpisode?: {
    episode: number;
    timeUntilAiring: number;
    airingAt?: number;
  } | null;
  [key: string]: any; // Các trường bổ sung khác từ API
}

// Định nghĩa State lưu trong Session Storage
export interface SearchSessionState {
  searchResults: AnimeData_animeSearch[];
  isSearching: boolean;
  viewTitle: string;
  page: number;
  canLoadMore: boolean;
  currentFilters: {
    keyword: string;
    filters: AnimeFilters;
    hasFilter?: boolean;
  } | null;
}