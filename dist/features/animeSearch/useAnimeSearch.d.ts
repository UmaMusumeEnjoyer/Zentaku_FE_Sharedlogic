import { AnimeData_animeSearch, AnimeFilters } from './animeSearch.types';
export declare const useAnimeSearchPage: () => {
    searchResults: AnimeData_animeSearch[];
    isSearching: boolean;
    loading: boolean;
    viewTitle: string;
    canLoadMore: boolean;
    currentFilters: {
        keyword: string;
        filters: AnimeFilters;
        hasFilter?: boolean;
    } | null;
    handleSearch: (keyword: string, filters: AnimeFilters) => Promise<void>;
    handleBackToHome: () => void;
    handleViewAllClick: (type: "TRENDING_NOW" | "POPULAR_THIS_SEASON" | "UPCOMING_NEXT_SEASON") => Promise<void>;
    handleLoadMore: () => Promise<void>;
};
//# sourceMappingURL=useAnimeSearch.d.ts.map