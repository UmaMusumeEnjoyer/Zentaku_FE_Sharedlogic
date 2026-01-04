var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect } from 'react';
// Import API & Utils (Giữ nguyên đường dẫn như logic cũ)
import { animeService } from '../../services/anime.service';
import { getCurrentSeasonInfo, getNextSeasonInfo } from '../../shared/utils/seasonUtils';
const SESSION_KEY = 'ANIME_SEARCH_STATE';
export const useAnimeSearchPage = () => {
    // --- STATE ---
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewTitle, setViewTitle] = useState('Search Results');
    const [page, setPage] = useState(1);
    const [canLoadMore, setCanLoadMore] = useState(false);
    // State lưu filter hiện tại để dùng cho Load More
    const [currentFilters, setCurrentFilters] = useState(null);
    // --- HELPER: MAP DATA ---
    const mapAnimeData = (rawItem) => (Object.assign({ id: rawItem.id, anilist_id: rawItem.id, title_romaji: rawItem.name_romaji || rawItem.romaji, english: rawItem.name_english || rawItem.english, cover_image: rawItem.cover_image || rawItem.cover, episodes: rawItem.airing_episodes || rawItem.episodes, average_score: rawItem.average_score, season: rawItem.season, next_airing_ep: null }, rawItem));
    // --- EFFECT: RESTORE STATE ---
    useEffect(() => {
        const savedState = sessionStorage.getItem(SESSION_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                setSearchResults(parsed.searchResults);
                setIsSearching(parsed.isSearching);
                setViewTitle(parsed.viewTitle);
                setPage(parsed.page);
                setCanLoadMore(parsed.canLoadMore);
                setCurrentFilters(parsed.currentFilters);
                if (parsed.isSearching) {
                    setTimeout(() => {
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                    }, 100);
                }
            }
            catch (error) {
                console.error("Failed to restore search state", error);
                sessionStorage.removeItem(SESSION_KEY);
            }
        }
    }, []);
    // --- EFFECT: AUTO SAVE STATE ---
    useEffect(() => {
        if (isSearching) {
            const stateToSave = {
                searchResults,
                isSearching,
                viewTitle,
                page,
                canLoadMore,
                currentFilters
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
        }
    }, [searchResults, isSearching, viewTitle, page, canLoadMore, currentFilters]);
    // --- HANDLER: BACK TO HOME ---
    const handleBackToHome = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setIsSearching(false);
        setSearchResults([]);
        setPage(1);
        setCurrentFilters({
            keyword: '',
            filters: {
                genre: 'Any', year: 'Any', season: 'Any',
                format: 'Any', status: 'Any', sort: 'POPULARITY_DESC'
            }
        });
    };
    // --- HANDLER: SEARCH ---
    const handleSearch = (keyword, filters) => __awaiter(void 0, void 0, void 0, function* () {
        const { genre, year, season, format, status, sort } = filters;
        const hasFilter = !!((genre && genre !== 'Any') ||
            (year && year !== 'Any') ||
            (season && season !== 'Any') ||
            (format && format !== 'Any') ||
            (status && status !== 'Any'));
        if ((!keyword || keyword.trim() === "") && !hasFilter) {
            handleBackToHome();
            return;
        }
        setLoading(true);
        setIsSearching(true);
        setViewTitle('Search Results');
        setSearchResults([]);
        setPage(1);
        setCurrentFilters({ keyword, filters, hasFilter });
        try {
            let mappedResults = [];
            // Case 1: Search by Criteria (Filter or Sort)
            if (hasFilter || (sort && sort !== 'POPULARITY_DESC')) {
                const criteriaBody = { page: 1, perpage: 20 };
                if (year && year !== 'Any')
                    criteriaBody.year = parseInt(year.toString());
                if (season && season !== 'Any')
                    criteriaBody.season = season;
                if (format && format !== 'Any')
                    criteriaBody.format = format;
                if (genre && genre !== 'Any')
                    criteriaBody.genres = genre;
                if (status && status !== 'Any')
                    criteriaBody.status = status;
                if (sort)
                    criteriaBody.sort = sort;
                if (keyword && keyword.trim() !== "")
                    criteriaBody.search = keyword;
                const response = yield animeService.searchAnimeByCriteria(criteriaBody);
                const rawResults = response.data.results || [];
                mappedResults = rawResults.map(mapAnimeData);
                setCanLoadMore(rawResults.length === 20);
            }
            // Case 2: Simple Name Search
            else if (keyword && keyword.trim() !== "") {
                const response = yield animeService.searchByName(keyword);
                const rawCandidates = response.data.candidates || [];
                mappedResults = rawCandidates.map(mapAnimeData);
                setCanLoadMore(false);
            }
            setSearchResults(mappedResults);
        }
        catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
            setCanLoadMore(false);
        }
        finally {
            setLoading(false);
        }
    });
    // --- HANDLER: VIEW ALL ---
    const handleViewAllClick = (type) => __awaiter(void 0, void 0, void 0, function* () {
        sessionStorage.removeItem(SESSION_KEY);
        if (type === 'TRENDING_NOW') {
            setLoading(true);
            setIsSearching(true);
            setViewTitle('Trending Now');
            setSearchResults([]);
            setPage(1);
            setCurrentFilters(null);
            try {
                const response = yield animeService.getTrending();
                const rawResults = response.data.trending || [];
                setSearchResults(rawResults.map(mapAnimeData));
                setCanLoadMore(false);
            }
            catch (error) {
                console.error("Fetch trending failed:", error);
            }
            finally {
                setLoading(false);
            }
            window.scrollTo({ top: 400, behavior: 'smooth' });
            return;
        }
        // Setup filter mặc định
        let targetFilters = {
            genre: 'Any', year: 'Any', season: 'Any',
            format: 'Any', status: 'Any', sort: 'POPULARITY_DESC'
        };
        if (type === 'POPULAR_THIS_SEASON') {
            const { year, season } = getCurrentSeasonInfo();
            targetFilters = Object.assign(Object.assign({}, targetFilters), { year, season });
            setViewTitle('Popular This Season');
        }
        else if (type === 'UPCOMING_NEXT_SEASON') {
            const { year, season } = getNextSeasonInfo();
            targetFilters = Object.assign(Object.assign({}, targetFilters), { year, season });
            setViewTitle('Upcoming Next Season');
        }
        // Trigger search với filter vừa tạo
        handleSearch('', targetFilters);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    });
    // --- HANDLER: LOAD MORE ---
    const handleLoadMore = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!currentFilters)
            return;
        setLoading(true);
        const nextPage = page + 1;
        try {
            const { filters } = currentFilters;
            const { genre, year, season, format, status, sort } = filters;
            const criteriaBody = { page: nextPage, perpage: 20 };
            if (year && year !== 'Any')
                criteriaBody.year = parseInt(year.toString());
            if (season && season !== 'Any')
                criteriaBody.season = season;
            if (format && format !== 'Any')
                criteriaBody.format = format;
            if (genre && genre !== 'Any')
                criteriaBody.genres = genre;
            if (status && status !== 'Any')
                criteriaBody.status = status;
            if (sort)
                criteriaBody.sort = sort;
            const response = yield animeService.searchAnimeByCriteria(criteriaBody);
            const rawResults = response.data.results || [];
            const newMappedResults = rawResults.map(mapAnimeData);
            setSearchResults((prev) => [...prev, ...newMappedResults]);
            setPage(nextPage);
            if (rawResults.length < 20)
                setCanLoadMore(false);
        }
        catch (error) {
            console.error("Load more failed:", error);
        }
        finally {
            setLoading(false);
        }
    });
    return {
        // State
        searchResults,
        isSearching,
        loading,
        viewTitle,
        canLoadMore,
        currentFilters,
        // Actions
        handleSearch,
        handleBackToHome,
        handleViewAllClick,
        handleLoadMore
    };
};
//# sourceMappingURL=useAnimeSearch.js.map