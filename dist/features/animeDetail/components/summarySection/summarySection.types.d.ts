export interface Anime {
    id: number | string;
    cover_image: string;
    name_romaji: string;
    desc: string;
}
export interface UserStatusData {
    watch_status: 'watching' | 'plan_to_watch' | 'completed' | 'dropped' | 'on_hold';
    score?: number;
    progress?: number;
    is_following?: boolean;
    anime?: number | string;
    [key: string]: any;
}
export interface SummarySectionProps {
    anime: Anime;
    hasBanner?: boolean;
}
//# sourceMappingURL=summarySection.types.d.ts.map