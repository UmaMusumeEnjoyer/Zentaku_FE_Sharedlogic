// src/hooks/useRankingFilter.ts
import { useMemo } from 'react';
export const useRankingFilter = (rankings) => {
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
//# sourceMappingURL=useRankingSection.js.map