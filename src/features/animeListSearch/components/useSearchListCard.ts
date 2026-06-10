import { SearchListData } from './SearchListCard.types';
import { SharedConfig } from '../../../api/config';

export const useSearchListCard = (
  listData: SearchListData,
  onNavigate?: (path: string) => void
) => {
  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(`/list/${listData.id}`);
    }
  };

  // Logic xử lý màu mặc định
  const cardColor = listData.color || '#3db4f2';

  const PLACEHOLDERS = {
    userAvatar: "https://i.pravatar.cc/150?img=68",
    username: "Unknown User"
  };
  const ASSET_BASE_URL = SharedConfig.VITE_BACKEND_DOMAIN || '';

  const getAvatar = (): string => {
    const avatarUrl = listData.ownerAvatar;
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

  const username = listData.ownerUsername || PLACEHOLDERS.username;

  return {
    handleCardClick,
    cardColor,
    avatarUrl: getAvatar(),
    username,
    bannerImage: getBanner(),
    placeholderAvatar: PLACEHOLDERS.userAvatar
  };
};