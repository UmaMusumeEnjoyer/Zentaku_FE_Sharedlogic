import { useCallback } from 'react';
export const useSectionGrid = (data, onViewAll) => {
    // Logic xử lý khi click nút View All
    const handleViewAllClick = useCallback((e) => {
        e.preventDefault(); // Ngăn chặn reload trang (behavior mặc định của thẻ a)
        if (onViewAll) {
            onViewAll();
        }
    }, [onViewAll]);
    // Logic kiểm tra xem có dữ liệu để hiển thị hay không
    // Giúp tránh lỗi crash nếu props data bị null/undefined khi map
    const hasData = Array.isArray(data) && data.length > 0;
    return {
        handleViewAllClick,
        hasData
    };
};
//# sourceMappingURL=useSectionGrid.js.map