// Định nghĩa cấu trúc Media (Anime/Manga liên quan)
export interface MediaItem {
  id: number | string;
  title: { romaji: string; english?: string; native?: string };
  coverImage: { large: string };
  format?: string;
}

// Định nghĩa dữ liệu Character trả về từ API
export interface CharacterData {
  id: number;
  name: { full: string; native?: string };
  image: { large: string };
  description?: string;
  media?: { nodes: MediaItem[] };
}

// Định nghĩa kiểu cho các thông tin phụ parse được từ description
export interface ExtraInfo {
  [key: string]: string;
}