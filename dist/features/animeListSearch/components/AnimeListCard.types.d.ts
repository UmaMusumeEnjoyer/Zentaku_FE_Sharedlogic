export interface OwnerInfo {
    username: string;
    avatar_url?: string | null;
}
export interface PreviewAnimeItem {
    cover_image?: string;
    [key: string]: any;
}
export interface AnimeListData {
    list_id: string | number;
    list_name: string;
    color?: string;
    like_count?: number;
    anime_count?: number;
    owner?: OwnerInfo;
    preview_anime?: (string | PreviewAnimeItem)[];
}
export interface AnimeListCardProps {
    listData: AnimeListData;
}
//# sourceMappingURL=AnimeListCard.types.d.ts.map