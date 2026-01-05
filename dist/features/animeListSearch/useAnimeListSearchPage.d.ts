import { AnimeListItem, SearchMetadata } from './AnimeListSearchPage.types';
export declare const useAnimeListSearchPage: () => {
    topLists: AnimeListItem[];
    searchResults: AnimeListItem[];
    searchMetadata: SearchMetadata | null;
    loadingTop: boolean;
    loadingSearch: boolean;
    isSearching: boolean;
    handleSearch: (keyword: string) => Promise<void>;
};
//# sourceMappingURL=useAnimeListSearchPage.d.ts.map