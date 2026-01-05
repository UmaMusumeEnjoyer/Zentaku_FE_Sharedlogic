import { SearchListData } from './SearchListCard.types';

export const useSearchListCard = (
  listData: SearchListData,
  onNavigate?: (path: string) => void
) => {
  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(`/list/${listData.list_id}`);
    }
  };

  // Logic xử lý màu mặc định
  const cardColor = listData.color || '#3db4f2';

  return {
    handleCardClick,
    cardColor
  };
};