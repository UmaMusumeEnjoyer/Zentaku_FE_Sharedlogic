export interface AnimeData {
    id: number | string;
    banner_image?: string;
    title?: any;
    cover_image?: string;
    [key: string]: any;
}
export interface UseAnimeDetailReturn {
    anime: AnimeData | null;
    loading: boolean;
    hasBanner: boolean;
    isNotFound: boolean;
}
//# sourceMappingURL=animeDetail.types.d.ts.map