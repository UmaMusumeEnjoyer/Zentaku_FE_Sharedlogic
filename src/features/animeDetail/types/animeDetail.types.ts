// src/features/anime/types.ts

// Định nghĩa khung dữ liệu cho Anime (bạn có thể bổ sung thêm các trường khác tùy API)
export interface AnimeData {
  id: number | string;
  banner_image?: string;
  title?: any;
  cover_image?: string;
  // ... thêm các trường khác mà SummarySection/InfoSidebar cần dùng
  [key: string]: any; 
}

export interface UseAnimeDetailReturn {
  anime: AnimeData | null;
  loading: boolean;
  hasBanner: boolean;
  isNotFound: boolean;
}