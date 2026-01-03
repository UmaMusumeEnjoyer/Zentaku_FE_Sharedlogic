export interface UserProfile {
    username: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    date_joined?: string;
    is_staff?: boolean;
    is_own_profile?: boolean;
}
export interface CustomList {
    list_id: number;
    list_name: string;
    description: string;
    is_private: boolean;
    like_count?: number;
}
export interface ActivityItem {
    id: number;
    action_type: 'followed_anime' | 'create_list' | 'updated_followed_anime';
    ago_seconds: number;
    metadata?: {
        list_name?: string;
        title?: string;
    };
    target_id: string | number;
}
export interface HeatmapData {
    [date: string]: number;
}
//# sourceMappingURL=profilePage.types.d.ts.map