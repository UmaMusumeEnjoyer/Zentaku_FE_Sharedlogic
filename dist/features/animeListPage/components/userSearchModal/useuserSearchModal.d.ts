import { SearchUser, ListMember_userSearchModal as ListMember } from './userSearchModal.types';
export declare const useUserSearchModal: (isOpen: boolean, listId: string, roleType: "editor" | "viewer", currentMembers: ListMember[], onUserAdded: () => void, onClose: () => void) => {
    searchTerm: string;
    results: SearchUser[];
    loading: boolean;
    processingIds: string[];
    isEditorMode: boolean;
    setSearchTerm: import("react").Dispatch<import("react").SetStateAction<string>>;
    handleClose: () => void;
    handleAddUser: (user: SearchUser) => Promise<void>;
};
//# sourceMappingURL=useuserSearchModal.d.ts.map