import { SearchUser, ListMember_userSearchModal as ListMember, ButtonState } from './userSearchModal.types';
export declare const useUserSearchResultItem: (user: SearchUser, currentMembers: ListMember[], isEditorMode: boolean, isProcessing: boolean, defaultAvatar?: string, backendDomain?: string) => {
    displayAvatar: string;
    existingMember: ListMember | undefined;
    isOwner: boolean | undefined;
    buttonState: ButtonState;
    statusText: string | null;
};
//# sourceMappingURL=useUserSearchResultItem.d.ts.map