export interface OwnerInfo {
  username: string;
  avatar_url?: string | null;
}

export interface PreviewAnimeItem {
  cover_image?: string;
  [key: string]: any;
}

export interface AnimeListData {
  id: string | number;
  name: string;
  slug?: string;
  color?: string;
  likeCount?: number;
  itemCount?: number;
  ownerUsername?: string;
  ownerAvatar?: string;
  owner?: OwnerInfo; // Fallback nếu có
  bannerImage?: string;
}

export interface AnimeListCardProps {
  listData: AnimeListData;
}