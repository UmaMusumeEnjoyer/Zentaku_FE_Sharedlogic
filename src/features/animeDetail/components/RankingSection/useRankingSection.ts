// src/hooks/useRankingFilter.ts
import { useMemo } from 'react';
import { Ranking } from './rankingSection.types';

export const useRankingFilter = (rankings: Ranking[] | undefined) => {
  // Sử dụng useMemo để tránh lọc lại không cần thiết khi component re-render
  const filteredRankings = useMemo(() => {
    if (!rankings || rankings.length === 0) {
      return [];
    }

    // Logic nghiệp vụ: Lọc bỏ các ranking là "all_time"
    return rankings.filter((r) => !r.all_time);
  }, [rankings]);

  return filteredRankings;
};