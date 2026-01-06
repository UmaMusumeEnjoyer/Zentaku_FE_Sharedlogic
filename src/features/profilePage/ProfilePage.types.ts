// Định nghĩa User Profile từ API
export interface UserProfile_ProfilePage {
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string | undefined;
  date_joined?: string;
  is_staff?: boolean;
  is_own_profile?: boolean; // Cờ quan trọng từ backend
  [key: string]: any;
}

// Định nghĩa Custom List
export interface CustomList {
  list_id: number | string;
  list_name: string;
  description?: string;
  is_private: boolean;
  like_count?: number;
  [key: string]: any;
}

// Dữ liệu form tạo list mới
export interface NewListData {
  list_name: string;
  description: string;
  is_private: boolean;
  color: string;
}

// Props (hiện tại trang này nhận tham số từ URL nên props rỗng)
export interface ProfilePageProps {}