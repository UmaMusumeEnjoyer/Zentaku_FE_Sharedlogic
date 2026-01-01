export declare const userService: {
    getProfile: (username: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    updateProfile: (userData: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    uploadAvatar: (file: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    updateAnimeStatus: (animeId: string, data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getAnimeStatus: (animeId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    deleteAnimeStatus: (animeId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getHeatmap: (username: string) => Promise<import("axios").AxiosResponse<any, any, {}> | {
        data: {};
    }>;
};
//# sourceMappingURL=user.service.d.ts.map