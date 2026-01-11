import { useMemo, useCallback } from 'react';
export const useUserAnimeGroup = (animeList, isCurrentUser, canEdit, deleteMode, selectedAnimeIds) => {
    // Logic quyền chỉnh sửa: Phải là chính chủ VÀ có quyền edit
    const hasEditPermission = useMemo(() => {
        return isCurrentUser && canEdit;
    }, [isCurrentUser, canEdit]);
    // Kiểm tra anime có được chọn không
    const isAnimeSelected = useCallback((animeId) => {
        return selectedAnimeIds.includes(animeId);
    }, [selectedAnimeIds]);
    // Get anime ID (ưu tiên _anilist_id, đảm bảo không undefined)
    const getAnimeId = useCallback((anime) => {
        var _a, _b;
        return (_b = (_a = anime._anilist_id) !== null && _a !== void 0 ? _a : anime.anilist_id) !== null && _b !== void 0 ? _b : anime.id;
    }, []);
    // Kiểm tra có nên hiển thị group không
    const shouldRender = useMemo(() => {
        return animeList.length > 0;
    }, [animeList]);
    return {
        // Computed
        hasEditPermission,
        shouldRender,
        animeCount: animeList.length,
        // Methods
        isAnimeSelected,
        getAnimeId,
    };
};
//# sourceMappingURL=useuserAnimeGroup.js.map