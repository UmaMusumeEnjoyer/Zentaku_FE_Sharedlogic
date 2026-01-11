import { ListInfo, GroupedAnime, ListMember, ListRequest, RequestType, ModalRoleType, AnimeItemDetail } from './animeListPage.types';
type ToLocation = string | {
    pathname?: string;
    search?: string;
    hash?: string;
    state?: any;
};
type NavigateOptionsLike = {
    replace?: boolean;
    state?: any;
};
interface NavigateLike {
    (to: ToLocation, options?: NavigateOptionsLike): void;
    (delta: number): void;
}
export declare const useAnimeListPage: (listId: string, locationState: any, onNavigate?: NavigateLike) => {
    currentUsername: string | null;
    currentPermission: string | null;
    canEdit: boolean;
    isViewer: boolean;
    listInfo: ListInfo;
    groupedAnime: GroupedAnime;
    loading: boolean;
    searchTerm: string;
    members: ListMember[];
    pendingRequests: ListRequest[];
    showEditModal: boolean;
    showAddModal: boolean;
    showUserModal: boolean;
    modalRoleType: ModalRoleType;
    showRequestModal: boolean;
    requestType: RequestType;
    isSubmittingRequest: boolean;
    deleteMode: boolean;
    selectedAnimeIds: (string | number)[];
    isDeleting: boolean;
    allAnimeInList: AnimeItemDetail[];
    currentUserHasItems: boolean;
    setSearchTerm: import("react").Dispatch<import("react").SetStateAction<string>>;
    setShowAddModal: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setShowEditModal: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setShowUserModal: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setShowRequestModal: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    filterAnime: (list: AnimeItemDetail[]) => AnimeItemDetail[];
    handleAcceptRequest: (request: ListRequest) => Promise<void>;
    handleRejectRequest: (request: ListRequest) => Promise<void>;
    handleEditListClick: () => void;
    handleUpdateSuccess: (updatedData: Partial<ListInfo>) => void;
    handleDeleteList: () => Promise<void>;
    handleOpenJoinRequest: () => void;
    handleOpenEditRequest: () => void;
    handleSubmitRequest: (message: string) => Promise<void>;
    handleAddAnime: (anime: any) => Promise<void>;
    toggleDeleteMode: () => void;
    handleSelectAnime: (anilistId: string | number) => void;
    handleConfirmDelete: () => Promise<void>;
    handleOpenAddEditor: () => void;
    handleOpenAddViewer: () => void;
    handleUserAdded: () => void;
    handleRemoveMember: (username: string) => Promise<void>;
};
export {};
//# sourceMappingURL=useAnimeListPage.d.ts.map