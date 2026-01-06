export interface UserProfile_ProfilePage {
    username: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string | undefined;
    date_joined?: string;
    is_staff?: boolean;
    is_own_profile?: boolean;
    [key: string]: any;
}
export interface CustomList {
    list_id: number | string;
    list_name: string;
    description?: string;
    is_private: boolean;
    like_count?: number;
    [key: string]: any;
}
export interface NewListData {
    list_name: string;
    description: string;
    is_private: boolean;
    color: string;
}
export interface ProfilePageProps {
}
//# sourceMappingURL=ProfilePage.types.d.ts.map