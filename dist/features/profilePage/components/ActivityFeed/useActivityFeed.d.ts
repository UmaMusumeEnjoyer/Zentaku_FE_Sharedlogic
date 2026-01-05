import { ActivityItem } from './ActivityFeed.types';
export declare const useActivityFeed: (filterDate?: string) => {
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
    getActionDescription: (type: string) => "followed anime" | "created custom list" | "updated progress" | "performed action";
    getTargetName: (item: ActivityItem) => string;
};
//# sourceMappingURL=useActivityFeed.d.ts.map