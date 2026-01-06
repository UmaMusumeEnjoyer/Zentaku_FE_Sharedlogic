import { User } from '../features/authPage/auth.types';
export declare const userService: {
    getUserProfile: (username: string) => Promise<import("axios").AxiosResponse<User, any, {}>>;
    updateUserProfile: (userData: Partial<User>) => Promise<import("axios").AxiosResponse<User, any, {}>>;
    uploadAvatar: (file: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    updateAnimeStatus: (animeId: string, data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getAnimeStatus: (animeId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    deleteAnimeStatus: (animeId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getHeatmap: (username: string) => Promise<import("axios").AxiosResponse<any, any, {}> | {
        data: {};
    }>;
    searchUsers: (keyword: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getUserActivity: (username: string) => Promise<import("axios").AxiosResponse<any, any, {}> | {
        data: {};
    }>;
    getUserAnimeList: (username: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    deleteUserAvatar: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
//# sourceMappingURL=user.service.d.ts.map