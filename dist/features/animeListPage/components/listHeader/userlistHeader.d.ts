import { LikerUser_listHeader as LikerUser } from './listHeader.types';
export declare const useListHeader: (listId: string, isOwner: boolean) => {
    isLiked: boolean;
    likeCount: number;
    isLoadingLike: boolean;
    showLikersModal: boolean;
    likersList: LikerUser[];
    showingCount: number;
    handleToggleLike: () => Promise<void>;
    handleViewLikers: () => Promise<void>;
    handleCloseLikersModal: () => void;
};
//# sourceMappingURL=userlistHeader.d.ts.map