export interface AnimeDetailData {
    id: number | string;
    banner_image?: string;
    [key: string]: any;
}
export interface AnimeDetailHook {
    anime: AnimeDetailData | null;
    loading: boolean;
    error: string | null;
    hasBanner: boolean;
}
//# sourceMappingURL=animeDetail.types.d.ts.map