import { useMemo } from 'react';
// Định nghĩa config bên ngoài hook để tránh khởi tạo lại
const STATUS_CONFIG = {
    PLANNING: { color: 'rgb(2, 169, 255)', order: 1 },
    CURRENT: { color: 'rgb(146, 86, 243)', order: 2 },
    DROPPED: { color: 'rgb(247, 121, 164)', order: 4 },
    PAUSED: { color: '#E91E63', order: 3 },
    COMPLETED: { color: 'rgb(104, 214, 57)', order: 5 },
};
export const useStatusDistribution = (distribution) => {
    // 1. Logic sắp xếp (Sorting Logic)
    const sortedDistribution = useMemo(() => {
        if (!distribution)
            return [];
        return [...distribution].sort((a, b) => {
            var _a, _b;
            const orderA = ((_a = STATUS_CONFIG[a.status]) === null || _a === void 0 ? void 0 : _a.order) || 99;
            const orderB = ((_b = STATUS_CONFIG[b.status]) === null || _b === void 0 ? void 0 : _b.order) || 99;
            return orderA - orderB;
        });
    }, [distribution]);
    // 2. Logic tính tổng (Aggregation Logic)
    const totalUsers = useMemo(() => {
        return sortedDistribution.reduce((sum, item) => sum + item.amount, 0);
    }, [sortedDistribution]);
    // 3. Helper lấy màu sắc
    const getStatusColor = (status) => {
        var _a;
        return ((_a = STATUS_CONFIG[status]) === null || _a === void 0 ? void 0 : _a.color) || '#ccc'; // Fallback color
    };
    return {
        sortedDistribution,
        totalUsers,
        getStatusColor,
    };
};
//# sourceMappingURL=useStatusDistribution.js.map