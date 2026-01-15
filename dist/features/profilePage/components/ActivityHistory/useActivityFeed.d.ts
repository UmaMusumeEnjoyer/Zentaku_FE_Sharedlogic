import { HeatmapCounts, ActivityDay } from './ActivityHistory.types';
export declare const useActivityHistory: (username: string, onTotalCountChange?: (total: number) => void) => {
    heatmapCounts: HeatmapCounts;
    loading: boolean;
    yearWeeks: ActivityDay[][];
    getLevelClass: (count: number) => "level-0" | "level-1" | "level-2" | "level-3" | "level-4";
};
//# sourceMappingURL=useActivityFeed.d.ts.map