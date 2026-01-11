export interface AnimeData {
    id?: number | string;
    anilist_id?: number | string;
    title_romaji?: string;
    name_romaji?: string;
    name_native?: string;
    name_english?: string;
    cover_image: string;
    episode_progress?: number;
    episodes?: number;
    next_airing_ep?: {
        episode: number;
        timeUntilAiring: number;
    };
}
export declare const getAnimeTitle: (anime: AnimeData, language?: "en" | "jp") => string;
export declare const getAnimeLinkId: (anime: AnimeData) => number | string;
export declare const getAnimeDisplayInfo: (anime: AnimeData) => string | null;
//# sourceMappingURL=AnimeCard.d.ts.map