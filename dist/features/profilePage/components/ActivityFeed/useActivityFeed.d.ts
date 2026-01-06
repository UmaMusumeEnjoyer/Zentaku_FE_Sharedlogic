import { ActivityItem } from './ActivityFeed.types';
interface UseActivityFeedParams {
    filterDate?: string;
    t: (key: string, options?: any) => string;
}
export declare const useActivityFeed: ({ filterDate, t }: UseActivityFeedParams) => {
    username: string | null;
    loading: boolean;
    displayItems: ActivityItem[];
    canLoadMore: boolean;
    hasActivity: boolean;
    handleLoadMore: () => void;
    getTargetUrl: (item: ActivityItem) => string;
    formatTimeAgo: (s: number) => string;
    getActionClass: (type: string) => "feed-icon-add" | "feed-icon-update" | "feed-icon-default";
    getActionIconChar: (type: string) => "☰" | "+" | "✎" | "•";
    getActionDescription: (type: string) => string;
    getTargetName: (item: ActivityItem) => string;
};
export {};
//# sourceMappingURL=useActivityFeed.d.ts.map