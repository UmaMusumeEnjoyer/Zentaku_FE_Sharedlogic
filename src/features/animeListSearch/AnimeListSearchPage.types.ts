// Định nghĩa cấu trúc của một List (dựa trên cách dùng list.list_id trong code gốc)
export interface AnimeListItem {
  id: string | number;
  name: string;
  slug?: string;
  description?: string;
  color?: string; // Giữ lại cho compatibility với card hiện tại nếu cần
  likeCount?: number;
  itemCount?: number;
  bannerImage?: string;
  ownerUsername?: string;
  ownerAvatar?: string;
  privacy?: string;
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