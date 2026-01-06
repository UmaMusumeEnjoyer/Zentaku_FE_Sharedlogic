export interface ActivityDay {
    date: string;
    month: string;
    day: number;
    isFuture: boolean;
}
export interface ActivityHistoryProps {
    onTotalCountChange?: (total: number) => void;
    selectedDate?: string | null;
    onDateSelect?: (date: string) => void;
}
export interface HeatmapCounts {
    [date: string]: number;
}
//# sourceMappingURL=ActivityHistory.typs.d.ts.map