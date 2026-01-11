import { AnimeItem_addAnimeModal as AnimeItem, UserAnimeData, AnimeStatusKey } from './addAnimeModal.types';
export declare const useAddAnimeModal: (isOpen: boolean, currentList?: AnimeItem[]) => {
    userData: UserAnimeData | null;
    globalResults: AnimeItem[];
    isGlobalSearch: boolean;
    loading: boolean;
    searchTerm: string;
    statusKeys: AnimeStatusKey[];
    existingIds: Set<string>;
    mapAnimeData: (rawItem: any) => AnimeItem;
    handleSearchAction: () => Promise<void>;
    handleInputChange: (value: string) => void;
    handleAddClick: (anime: AnimeItem, onAddAnime: (anime: AnimeItem) => Promise<void>) => Promise<void>;
    formatStatusTitle: (status: string) => string;
    getAnimeState: (animeIdStr: string) => {
        isAdding: boolean;
        isAdded: boolean;
    };
};
//# sourceMappingURL=useaddAnimeModal.d.ts.map