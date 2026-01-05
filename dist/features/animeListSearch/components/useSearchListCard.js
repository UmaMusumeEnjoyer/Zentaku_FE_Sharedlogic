export const useSearchListCard = (listData, onNavigate) => {
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
//# sourceMappingURL=useSearchListCard.js.map