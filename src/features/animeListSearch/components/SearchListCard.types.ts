export interface SearchListData {
  list_id: string | number;
  list_name: string;
  description?: string;
  color?: string;
  like_count?: number;
  [key: string]: any;
}

export interface SearchListCardProps {
  listData: SearchListData;
  onNavigate?: (path: string) => void;  // ← Thêm callback này
}