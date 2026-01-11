export interface UserAnimeGroupProps {
    user: string;
    animeList: AnimeItem_userAnimeGroup[];
    isCurrentUser: boolean;
    canEdit: boolean;
    deleteMode: boolean;
    selectedAnimeIds: (string | number)[];
    isDeleting: boolean;
    onOpenAddModal: () => void;
    onToggleDeleteMode: () => void;
    onConfirmDelete: () => void;
    onSelectAnime: (animeId: string | number) => void;
}
export interface AnimeItem_userAnimeGroup {
    id: string | number;
    _anilist_id?: string | number;
    anilist_id?: string | number;
    title_romaji?: string;
    name_romaji?: string;
    name_english?: string;
    cover_image: string;
    episodes?: number;
    average_score?: number;
    _added_by?: string;
    _added_date?: string;
    _note?: string;
    episode_progress?: number;
    next_airing_ep?: {
        episode: number;
        timeUntilAiring: number;
    };
    [key: string]: any;
}
//# sourceMappingURL=userAnimeGroup.types.d.ts.map