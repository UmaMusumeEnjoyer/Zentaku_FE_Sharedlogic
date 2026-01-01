import { useMemo } from 'react';
export const useScoreDistribution = (distribution) => {
    // 1. Tính toán giá trị lớn nhất để vẽ chiều cao cột (dùng useMemo để tránh tính lại không cần thiết)
    const maxAmount = useMemo(() => {
        if (!distribution || distribution.length === 0)
            return 0;
        return Math.max(...distribution.map((item) => item.amount));
    }, [distribution]);
    // 2. Logic xác định màu sắc dựa trên điểm số
    const getScoreColor = (score) => {
        if (score <= 40)
            return '#E84F63'; // Đỏ
        if (score <= 60)
            return '#FBC02D'; // Vàng
        if (score <= 80)
            return '#8BC34A'; // Xanh lá nhạt
        return '#4CAF50'; // Xanh lá đậm
    };
    return {
        maxAmount,
        getScoreColor,
    };
};
//# sourceMappingURL=useScoreDistribution.js.map