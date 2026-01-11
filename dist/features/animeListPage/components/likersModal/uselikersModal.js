import { useMemo } from 'react';
export const useLikersModal = (likersData, totalLikes) => {
    const isEmpty = useMemo(() => likersData.length === 0, [likersData]);
    const displayCount = useMemo(() => likersData.length, [likersData]);
    return {
        isEmpty,
        displayCount,
    };
};
//# sourceMappingURL=uselikersModal.js.map