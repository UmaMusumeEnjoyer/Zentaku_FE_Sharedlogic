export interface Ranking {
    id: number | string;
    rank: number;
    type: 'RATED' | 'POPULAR' | string;
    context: string;
    year: number | null;
    season: string | null;
    all_time?: boolean;
}
//# sourceMappingURL=rankingSection.types.d.ts.map