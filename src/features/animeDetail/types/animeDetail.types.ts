// src/pages/AnimeDetail/types.ts

// Định nghĩa Interface cho dữ liệu Anime chi tiết
// Lưu ý: Đây là object lớn chứa dữ liệu cho cả Summary, Sidebar và MainContent
export interface AnimeDetailData {
  id: number | string;
  banner_image?: string;
  [key: string]: any; // Cho phép chứa các trường khác để truyền xuống con
}

export interface AnimeDetailHook {
  anime: AnimeDetailData | null;
  loading: boolean;
  error: string | null;
  hasBanner: boolean;
}