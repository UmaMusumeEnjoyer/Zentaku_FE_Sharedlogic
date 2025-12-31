// Định nghĩa cấu trúc Media (Anime/Manga liên quan)
export interface MediaItem {
  id: number;
  title_romaji: string;
  cover_image: string;
}

// Định nghĩa dữ liệu Character trả về từ API
export interface CharacterData {
  id: number;
  name_full: string;
  name_native: string;
  image: string;
  description: string;
  media: MediaItem[];
}

// Định nghĩa kiểu cho các thông tin phụ parse được từ description
export interface ExtraInfo {
  [key: string]: string;
}