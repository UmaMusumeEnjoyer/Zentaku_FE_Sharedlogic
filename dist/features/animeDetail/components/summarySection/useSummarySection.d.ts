import { Anime, UserStatusData } from './summarySection.types';
export declare const useSummarySection: (anime: Anime) => {
    isModalOpen: boolean;
    currentStatusData: UserStatusData | null;
    buttonLabel: string;
    handleBtnClick: () => void;
    handleCloseModal: () => void;
    handleSave: (apiPayload: any, isUpdateMode?: boolean) => Promise<void>;
    handleDelete: () => void;
};
//# sourceMappingURL=useSummarySection.d.ts.map