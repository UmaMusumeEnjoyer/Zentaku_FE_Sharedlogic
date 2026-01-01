import { useMemo } from 'react';
import { StatusItem, StatusConfig } from './StatisticsSection.types.Status';

// Định nghĩa config bên ngoài hook để tránh khởi tạo lại
const STATUS_CONFIG: Record<string, StatusConfig> = {
  PLANNING: { color: 'rgb(2, 169, 255)', order: 1 },
  CURRENT: { color: 'rgb(146, 86, 243)', order: 2 },
  DROPPED: { color: 'rgb(247, 121, 164)', order: 4 },
  PAUSED: { color: '#E91E63', order: 3 },
  COMPLETED: { color: 'rgb(104, 214, 57)', order: 5 },
};

export const useStatusDistribution = (distribution: StatusItem[]) => {
  // 1. Logic sắp xếp (Sorting Logic)
  const sortedDistribution = useMemo(() => {
    if (!distribution) return [];
    return [...distribution].sort((a, b) => {
      const orderA = STATUS_CONFIG[a.status]?.order || 99;
      const orderB = STATUS_CONFIG[b.status]?.order || 99;
      return orderA - orderB;
    });
  }, [distribution]);

  // 2. Logic tính tổng (Aggregation Logic)
  const totalUsers = useMemo(() => {
    return sortedDistribution.reduce((sum, item) => sum + item.amount, 0);
  }, [sortedDistribution]);

  // 3. Helper lấy màu sắc
  const getStatusColor = (status: string): string => {
    return STATUS_CONFIG[status]?.color || '#ccc'; // Fallback color
  };

  return {
    sortedDistribution,
    totalUsers,
    getStatusColor,
  };
};