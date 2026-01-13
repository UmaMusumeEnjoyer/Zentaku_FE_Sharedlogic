import { Anime, UserStatusData } from './summarySection.types';
export declare const useSummarySection: (anime: Anime) => {
    isModalOpen: boolean;
    currentStatusData: UserStatusData | null;
    watchStatus: "watching" | "plan_to_watch" | "completed" | "dropped" | "on_hold" | null;
    isLoadingStatus: boolean;
    isFollowing: boolean | null | undefined;
    handleBtnClick: () => void;
    handleCloseModal: () => void;
    handleSave: (apiPayload: any, isUpdateMode?: boolean) => Promise<void>;
    handleDelete: () => void;
};
//# sourceMappingURL=useSummarySection.d.ts.map