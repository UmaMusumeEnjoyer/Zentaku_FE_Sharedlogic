export interface TrailerInfo {
    id: string;
    site: string;
    thumbnail?: string;
}
export interface Anime_mainContentArea {
    id: number | string;
    trailer?: TrailerInfo;
}
export interface RankingItem {
    rank: number;
    type: string;
}
export interface DistributionItem {
    [key: string]: any;
    amount: number;
}
export interface AnimeStats {
    rankings: RankingItem[];
    status_distribution: DistributionItem[];
    score_distribution: DistributionItem[];
}
export interface MainContentAreaProps {
    anime: Anime_mainContentArea;
}
export interface SectionProps {
    title: string;
    children: React.ReactNode;
}
export interface TrailerProps {
    trailerInfo?: TrailerInfo;
}
//# sourceMappingURL=mainContentArea.types.d.ts.map