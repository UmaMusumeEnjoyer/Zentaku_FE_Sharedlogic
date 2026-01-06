import { ChangeEvent, FormEvent } from 'react';
import { UserProfile_ProfilePage, CustomList, NewListData } from './ProfilePage.types';
export interface UseProfilePageCallbacks {
    onNavigateToUserProfile: (username: string) => void;
    onNavigateToList: (listId: string | number, listData?: CustomList) => void;
}
export declare const useProfilePage: (routeUsername?: string, callbacks?: UseProfilePageCallbacks) => {
    targetUsername: string;
    isOwnProfile: boolean;
    userProfile: UserProfile_ProfilePage | null;
    profileLoading: boolean;
    getDisplayName: () => string;
    getAvatarUrl: (url?: string | null) => string;
    formatDateJoined: (dateString?: string) => string;
    activeTab: string;
    handleTabChange: (tabName: string) => void;
    totalContributions: number;
    setTotalContributions: import("react").Dispatch<import("react").SetStateAction<number>>;
    selectedDate: string | null;
    handleDateSelect: (date: string) => void;
    customLists: CustomList[];
    listsLoading: boolean;
    likedLists: CustomList[];
    likedListsLoading: boolean;
    handleListClick: (list: CustomList) => void;
    favoriteList: any[];
    favLoading: boolean;
    showEditModal: boolean;
    setShowEditModal: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    handleUpdateSuccess: (updatedUser: UserProfile_ProfilePage) => void;
    showCreateModal: boolean;
    setShowCreateModal: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    newListData: NewListData;
    creating: boolean;
    handleCreateListSubmit: (e: FormEvent) => Promise<void>;
    handleNewListInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
//# sourceMappingURL=useProfilePage.d.ts.map