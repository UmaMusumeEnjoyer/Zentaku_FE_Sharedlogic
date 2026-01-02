// src/components/GlobalSearch/types.ts

export interface SearchResultUser {
  id?: string | number;
  username: string;
  avatar?: string; // Tùy chọn nếu API trả về ảnh sau này
  [key: string]: any;
}

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}