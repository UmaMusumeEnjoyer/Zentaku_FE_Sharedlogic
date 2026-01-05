import { ChangeEvent, FormEvent } from 'react';
import { AnimeItem_AnimeSection, NotificationSettings } from './AnimeSection.types';
export declare const useAnimeSection: (animeList: AnimeItem_AnimeSection[], allowNotification?: boolean) => {
    isExpanded: boolean;
    showModal: boolean;
    isLoadingSettings: boolean;
    settings: NotificationSettings;
    hasData: boolean;
    displayedAnime: AnimeItem_AnimeSection[];
    showViewAllButton: boolean;
    handleNotifyClick: () => void;
    handleCloseModal: () => void;
    toggleExpand: () => void;
    handleSettingChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSaveSettings: (e: FormEvent) => Promise<void>;
};
//# sourceMappingURL=useAnimeSection.d.ts.map