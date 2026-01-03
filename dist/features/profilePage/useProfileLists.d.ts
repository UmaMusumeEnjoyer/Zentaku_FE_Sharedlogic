import { CustomList } from './profilePage.types';
export declare const useProfileLists: (username: string, isOwnProfile: boolean) => {
    customLists: CustomList[];
    likedLists: CustomList[];
    loading: boolean;
    createList: (listData: any) => Promise<void>;
};
//# sourceMappingURL=useProfileLists.d.ts.map