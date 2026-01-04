import React, { useCallback } from 'react';
import { AnimeItem_SectionGrid } from './sectionGrid.types';

export const useSectionGrid = (data: AnimeItem_SectionGrid[], onViewAll?: () => void) => {
  
  // Logic xử lý khi click nút View All
  const handleViewAllClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
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