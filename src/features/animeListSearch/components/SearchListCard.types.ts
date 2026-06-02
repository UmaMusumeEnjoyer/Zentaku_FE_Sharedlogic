export interface SearchListData {
  id: string | number;
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  likeCount?: number;
  itemCount?: number;
  ownerUsername?: string;
  ownerAvatar?: string;
  privacy?: string;
  bannerImage?: string;
  [key: string]: any;
}

export interface SearchListCardProps {
  listData: SearchListData;
  onNavigate?: (path: string) => void;  // ← Thêm callback này
}