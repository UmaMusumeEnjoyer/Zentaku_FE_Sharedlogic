import { AnimeItem_userAnimeGroup } from './userAnimeGroup.types';
export declare const useUserAnimeGroup: (animeList: AnimeItem_userAnimeGroup[], isCurrentUser: boolean, canEdit: boolean, deleteMode: boolean, selectedAnimeIds: (string | number)[]) => {
    hasEditPermission: boolean;
    shouldRender: boolean;
    animeCount: number;
    isAnimeSelected: (animeId: string | number) => boolean;
    getAnimeId: (anime: AnimeItem_userAnimeGroup) => string | number;
};
//# sourceMappingURL=useuserAnimeGroup.d.ts.map