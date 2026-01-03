import { ActivityItem } from './profilePage.types';
export declare const useActivityFeed: (username: string, filterDate: string | null) => {
    displayItems: ActivityItem[];
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    isEmpty: boolean;
};
//# sourceMappingURL=useActivityFeed.d.ts.map