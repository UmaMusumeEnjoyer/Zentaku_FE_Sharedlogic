export interface ActivityMetadata {
    title?: string;
    list_name?: string;
    [key: string]: any;
}
export interface ActivityItem {
    id: string | number;
    action_type: 'followed_anime' | 'create_list' | 'updated_followed_anime' | string;
    target_id: string | number;
    ago_seconds: number;
    metadata?: ActivityMetadata;
    created_at?: string;
}
export interface ActivityFeedProps {
    filterDate?: string;
}
//# sourceMappingURL=ActivityFeed.types.d.ts.map