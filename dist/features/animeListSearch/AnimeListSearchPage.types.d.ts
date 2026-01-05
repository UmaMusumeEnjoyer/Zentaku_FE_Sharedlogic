export interface AnimeListItem {
    list_id: string | number;
    list_name: string;
    description?: string;
    color?: string;
    like_count?: number;
    items_count?: number;
    [key: string]: any;
}
export interface SearchMetadata {
    total: number;
    showing: number;
}
export interface TopListsResponse {
    data: {
        most_liked_lists: AnimeListItem[];
    };
}
export interface SearchListsResponse {
    data: {
        query: string;
        lists: AnimeListItem[];
        total: number;
        showing: number;
    };
}
//# sourceMappingURL=AnimeListSearchPage.types.d.ts.map