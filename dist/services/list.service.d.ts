export declare const listService: {
    getUserLists: (username?: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    create: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getItems: (listId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    addItem: (listId: string, animeData: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getMembers: (listId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    requestJoin: (listId: string, message: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    toggleLike: (listId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getTrending: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
    search: (keyword: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getListsLikedByUser: (data?: {}) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getMostLikedLists: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
    searchCustomLists: (keyword: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
//# sourceMappingURL=list.service.d.ts.map