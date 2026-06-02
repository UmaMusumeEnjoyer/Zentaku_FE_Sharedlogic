import { useMemo, useCallback } from 'react';
import { AnimeItem_userAnimeGroup } from './userAnimeGroup.types';

export const useUserAnimeGroup = (
  animeList: AnimeItem_userAnimeGroup[],
  isCurrentUser: boolean,
  canEdit: boolean,
  deleteMode: boolean,
  selectedAnimeIds: (string | number)[]
) => {
  // Logic quyền chỉnh sửa: Được phép nếu có quyền edit (không quan trọng là group của ai)
  const hasEditPermission = useMemo(() => {
    return canEdit;
  }, [canEdit]);

  // Kiểm tra anime có được chọn không
  const isAnimeSelected = useCallback((animeId: string | number): boolean => {
    return selectedAnimeIds.includes(animeId);
  }, [selectedAnimeIds]);

  // Get anime ID (ưu tiên _anilist_id, đảm bảo không undefined)
  const getAnimeId = useCallback((anime: AnimeItem_userAnimeGroup): string | number => {
    return anime._anilist_id ?? anime.anilist_id ?? anime.id;
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