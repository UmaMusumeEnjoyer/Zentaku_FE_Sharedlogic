// Định nghĩa cấu trúc của một List (dựa trên cách dùng list.list_id trong code gốc)
export interface AnimeListItem {
  list_id: string | number;
  list_name: string;  // Changed from title?: string to list_name: string (required)
  description?: string;
  color?: string;
  like_count?: number;
  items_count?: number;
  // Các trường khác từ API trả về
  [key: string]: any;
}

// Metadata cho kết quả tìm kiếm (total, showing...)
export interface SearchMetadata {
  total: number;
  showing: number;
}

// Cấu trúc response từ API (để type safety cho ViewModel)
export interface TopListsResponse {
  data: {
    most_liked_lists: AnimeListItem[];
  };
}

export interface SearchListsResponse {
  data: {
    query: string;
    lists: AnimeListItem[];
    total: number;
    showing: number;
  };
}