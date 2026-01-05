import { AnimeListData } from './AnimeListCard.types';
import { SharedConfig } from '../../../api/config';

// Các hằng số được đưa vào ViewModel hoặc tách ra file constants riêng
const BASE_URL = SharedConfig.apiBaseUrl;
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
      onNavigate(`/list/${listData.list_id}`);
    }
  };

  // Logic xử lý Avatar
  const getAvatar = (): string => {
    const owner = listData.owner;
    if (!owner || !owner.avatar_url) return PLACEHOLDERS.userAvatar;
    
    return owner.avatar_url.startsWith('http') 
      ? owner.avatar_url 
      : `${BASE_URL}${owner.avatar_url}`;
  };

  const username = listData.owner?.username || PLACEHOLDERS.username;

  // Logic xử lý 3 ảnh Preview
  const getCoverImages = (): string[] => {
    const rawPreview = listData.preview_anime || [];

    // Map để lấy đường dẫn ảnh, xử lý cả trường hợp là object hoặc string
    const apiImages = rawPreview.map((item) => {
        if (typeof item === 'object' && item !== null && 'cover_image' in item) {
            return (item as any).cover_image;
        }
        return item as string;
    });
    
    let displayImages = [...apiImages];

    // Điền thêm placeholder nếu thiếu
    if (displayImages.length < 3) {
      displayImages = [
        ...displayImages,
        ...PLACEHOLDERS.coverImages.slice(displayImages.length, 3)
      ];
    }
    
    return displayImages.slice(0, 3);
  };

  return {
    handleCardClick,
    avatarUrl: getAvatar(),
    username,
    coverImages: getCoverImages(),
    placeholderAvatar: PLACEHOLDERS.userAvatar // Để dùng cho onError
  };
};