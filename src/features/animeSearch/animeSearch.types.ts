// Định nghĩa bộ lọc
export interface AnimeFilters {
  genre?: string;
  year?: string | number;
  season?: string;
  format?: string;
  status?: string;
  sort?: string;
}

// Định nghĩa cấu trúc Anime sau khi đã map dữ liệu
// Định nghĩa cấu trúc Anime sau khi đã map dữ liệu
export interface AnimeData_animeSearch {
  id: number | string;
  anilist_id: number | string;
  title_romaji?: string;
  name_romaji?: string;
  name_english?: string;
  name_native?: string;
  cover_image: string;
  episodes: number | undefined;
  average_score: number | null;
  season: string | null;
  next_airing_ep: any;
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