import { AnimeListData } from './AnimeListCard.types';
import { SharedConfig } from '../../../api/config';

// Các hằng số được đưa vào ViewModel hoặc tách ra file constants riêng
const ASSET_BASE_URL = SharedConfig.VITE_BACKEND_DOMAIN || '';
const PLACEHOLDERS = {
  coverImages: [
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDuy1eZV523.png",
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-m5ZMNtFioc7j.jpg",
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-Yfe1q3fW3qZ2.png"
  ],
  userAvatar: "https://i.pravatar.cc/150?img=68",
  username: "Unknown User"
};

export const useAnimeListCard = (
  listData: AnimeListData,
  onNavigate?: (path: string) => void
) => {
  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(`/list/${listData.id}`);
    }
  };

  // Logic xử lý Avatar
  const getAvatar = (): string => {
    const avatarUrl = listData.ownerAvatar || listData.owner?.avatar_url;
    if (!avatarUrl) return PLACEHOLDERS.userAvatar;
    
    const formattedUrl = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
    return avatarUrl.startsWith('http') 
      ? avatarUrl 
      : `${ASSET_BASE_URL}${formattedUrl}`;
  };

  const FALLBACK_BANNER = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_EKkkCeMlmiwTOTcuvq-IgSjufiZ4Rz80Zw&s';

  const getBanner = (): string => {
    const bannerUrl = listData.bannerImage;
    if (!bannerUrl || bannerUrl.startsWith('#')) return FALLBACK_BANNER;
    const formattedUrl = bannerUrl.startsWith('/') ? bannerUrl : `/${bannerUrl}`;
    return bannerUrl.startsWith('http') ? bannerUrl : `${ASSET_BASE_URL}${formattedUrl}`;
  };

  const username = listData.ownerUsername || listData.owner?.username || PLACEHOLDERS.username;

  return {
    handleCardClick,
    avatarUrl: getAvatar(),
    username,
    bannerImage: getBanner(),
    placeholderAvatar: PLACEHOLDERS.userAvatar // Để dùng cho onError
  };
};