export interface AnimeListPageParams {
    id: string;
}
export interface ListInfo {
    list_name: string;
    description: string;
    is_private: boolean;
    color: string;
    is_owner: boolean;
}
export interface GroupedAnime {
    [username: string]: AnimeItemDetail[];
}
export interface AnimeItemDetail {
    id: string | number;
    anilist_id?: string | number;
    _anilist_id?: string | number;
    _added_by?: string;
    _added_date?: string;
    _note?: string;
    name_romaji?: string;
    title_romaji?: string;
    title_english?: string;
    name_english?: string;
    cover_image: string;
    episodes?: number;
    average_score?: number;
    [key: string]: any;
}
export interface ListMember {
    user_id?: number | string;
    username: string;
    is_owner?: boolean;
    permission_level?: 'owner' | 'edit' | 'view' | 'viewer';
    can_edit?: boolean;
    avatar?: string;
    avatar_url?: string;
}
export interface ListRequest {
    request_id: string | number;
    username: string;
    request_type: 'join' | 'edit_permission' | 'edit';
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    requested_at: string;
}
export type RequestType = 'join' | 'edit';
export type ModalRoleType = 'editor' | 'viewer';
//# sourceMappingURL=animeListPage.types.d.ts.map