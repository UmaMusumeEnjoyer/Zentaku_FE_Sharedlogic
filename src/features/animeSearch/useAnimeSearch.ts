import { useState, useEffect, useCallback } from 'react';
import { AnimeData_animeSearch, AnimeFilters, SearchSessionState } from './animeSearch.types';

// Import API & Utils
import { searchService } from '../../services/search.service';
import { getCurrentSeasonInfo, getNextSeasonInfo } from '../../shared/utils/seasonUtils';

const SESSION_KEY = 'ANIME_SEARCH_STATE';

export const useAnimeSearchPage = () => {
  // --- STATE ---
  const [searchResults, setSearchResults] = useState<AnimeData_animeSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewTitle, setViewTitle] = useState('Search Results');
  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(false);
  
  // State lưu filter hiện tại để dùng cho Load More
  const [currentFilters, setCurrentFilters] = useState<{
    keyword: string;
    filters: AnimeFilters;
    hasFilter?: boolean;
  } | null>(null);

  // State cho các section data (thay thế hardcoded constants)
  const [trendingAnime, setTrendingAnime] = useState<AnimeData_animeSearch[]>([]);
  const [popularSeason, setPopularSeason] = useState<AnimeData_animeSearch[]>([]);
  const [upcomingNext, setUpcomingNext] = useState<AnimeData_animeSearch[]>([]);
  const [allTimePopular, setAllTimePopular] = useState<AnimeData_animeSearch[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  // --- HELPER: MAP DATA ---
  const mapAnimeData = useCallback((rawItem: any): AnimeData_animeSearch => ({
    id: rawItem.id,
    title: rawItem.title || { romaji: undefined, english: undefined, native: undefined },
    coverImage: rawItem.coverImage || { large: '' },
    episodes: rawItem.episodes,
    averageScore: rawItem.averageScore ?? null,
    popularity: rawItem.popularity,
    season: rawItem.season || null,
    nextAiringEpisode: rawItem.nextAiringEpisode || null,
  }), []);

  // --- EFFECT: LOAD SECTION DATA FROM API ---
  useEffect(() => {
    const loadSectionData = async () => {
      setSectionsLoading(true);
      try {
        // Gọi song song tất cả 4 API sections
        const [trendingRes, currentSeasonRes, nextSeasonRes, popularRes] = await Promise.allSettled([
          searchService.getTrending('anime', 1, 6),
          searchService.getCurrentSeasonal(1, 6),
          searchService.getNextSeasonal(1, 6),
          searchService.getPopular('anime', 1, 6),
        ]);

        // Trending Now
        if (trendingRes.status === 'fulfilled') {
          const data = trendingRes.value.data;
          const items = data?.trending || data?.items || data || [];
          setTrendingAnime(Array.isArray(items) ? items.map(mapAnimeData) : []);
        }

        // Popular This Season
        if (currentSeasonRes.status === 'fulfilled') {
          const data = currentSeasonRes.value.data;
          const items = data?.items || data || [];
          setPopularSeason(Array.isArray(items) ? items.map(mapAnimeData) : []);
        }

        // Upcoming Next Season
        if (nextSeasonRes.status === 'fulfilled') {
          const data = nextSeasonRes.value.data;
          const items = data?.items || data || [];
          setUpcomingNext(Array.isArray(items) ? items.map(mapAnimeData) : []);
        }

        // All Time Popular
        if (popularRes.status === 'fulfilled') {
          const data = popularRes.value.data;
          const items = data?.trending || data?.items || data || [];
          setAllTimePopular(Array.isArray(items) ? items.map(mapAnimeData) : []);
        }
      } catch (error) {
        console.error("Failed to load section data:", error);
      } finally {
        setSectionsLoading(false);
      }
    };

    loadSectionData();
  }, [mapAnimeData]);

  // --- EFFECT: RESTORE STATE ---
  useEffect(() => {
    const savedState = sessionStorage.getItem(SESSION_KEY);
    if (savedState) {
      try {
        const parsed: SearchSessionState = JSON.parse(savedState);
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
      } catch (error) {
        console.error("Failed to restore search state", error);
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  // --- EFFECT: AUTO SAVE STATE ---
  useEffect(() => {
    if (isSearching) {
      const stateToSave: SearchSessionState = {
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
  const handleSearch = async (keyword: string, filters: AnimeFilters) => {
    const { genre, year, season, format, status, sort } = filters;

    const hasFilter : boolean =
    !!(
      (genre && genre !== 'Any') ||
      (year && year !== 'Any') ||
      (season && season !== 'Any') ||
      (format && format !== 'Any') ||
      (status && status !== 'Any')
    );

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
      let mappedResults: AnimeData_animeSearch[] = [];

      // Case 1: Search by Criteria (Filter or Sort)
      if (hasFilter || (sort && sort !== 'POPULARITY_DESC')) {
        const queryParams: any = { page: 1, perPage: 20 };

        if (year && year !== 'Any') queryParams.year = parseInt(year.toString());
        if (season && season !== 'Any') queryParams.season = season;
        if (format && format !== 'Any') queryParams.format = format;
        if (genre && genre !== 'Any') queryParams.genres = genre;
        if (status && status !== 'Any') queryParams.status = status;
        if (sort) queryParams.sort = sort;
        if (keyword && keyword.trim() !== "") queryParams.q = keyword;

        const response = await searchService.searchAnime(queryParams);
        const responseData = response.data;
        const rawResults = responseData?.items || responseData || [];
        mappedResults = Array.isArray(rawResults) ? rawResults.map(mapAnimeData) : [];
        setCanLoadMore(responseData?.pageInfo?.hasNextPage ?? rawResults.length === 20);
      } 
      // Case 2: Simple Name Search
      else if (keyword && keyword.trim() !== "") {
        const response = await searchService.searchAnime({ q: keyword });
        const responseData = response.data;
        const rawResults = responseData?.items || responseData || [];
        mappedResults = Array.isArray(rawResults) ? rawResults.map(mapAnimeData) : [];
        setCanLoadMore(responseData?.pageInfo?.hasNextPage ?? false);
      }

      setSearchResults(mappedResults);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setCanLoadMore(false);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: VIEW ALL ---
  const handleViewAllClick = async (type: 'TRENDING_NOW' | 'POPULAR_THIS_SEASON' | 'UPCOMING_NEXT_SEASON') => {
    sessionStorage.removeItem(SESSION_KEY);

    if (type === 'TRENDING_NOW') {
      setLoading(true);
      setIsSearching(true);
      setViewTitle('Trending Now');
      setSearchResults([]);
      setPage(1);
      setCurrentFilters(null);

      try {
        const response = await searchService.getTrending('anime');
        const responseData = response.data;
        const rawResults = responseData?.trending || responseData?.items || responseData || [];
        setSearchResults(Array.isArray(rawResults) ? rawResults.map(mapAnimeData) : []);
        setCanLoadMore(false);
      } catch (error) {
        console.error("Fetch trending failed:", error);
      } finally {
        setLoading(false);
      }
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    // Setup filter mặc định
    let targetFilters: AnimeFilters = {
      genre: 'Any', year: 'Any', season: 'Any',
      format: 'Any', status: 'Any', sort: 'POPULARITY_DESC'
    };

    if (type === 'POPULAR_THIS_SEASON') {
      const { year, season } = getCurrentSeasonInfo();
      targetFilters = { ...targetFilters, year, season };
      setViewTitle('Popular This Season');
    } else if (type === 'UPCOMING_NEXT_SEASON') {
      const { year, season } = getNextSeasonInfo();
      targetFilters = { ...targetFilters, year, season };
      setViewTitle('Upcoming Next Season');
    }

    // Trigger search với filter vừa tạo
    handleSearch('', targetFilters);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // --- HANDLER: LOAD MORE ---
  const handleLoadMore = async () => {
    if (!currentFilters) return;
    setLoading(true);
    const nextPage = page + 1;

    try {
      const { filters } = currentFilters;
      const { genre, year, season, format, status, sort } = filters;

      const queryParams: any = { page: nextPage, perPage: 20 };

      if (year && year !== 'Any') queryParams.year = parseInt(year.toString());
      if (season && season !== 'Any') queryParams.season = season;
      if (format && format !== 'Any') queryParams.format = format;
      if (genre && genre !== 'Any') queryParams.genres = genre;
      if (status && status !== 'Any') queryParams.status = status;
      if (sort) queryParams.sort = sort;

      const response = await searchService.searchAnime(queryParams);
      const responseData = response.data;
      const rawResults = responseData?.items || responseData || [];
      const newMappedResults = Array.isArray(rawResults) ? rawResults.map(mapAnimeData) : [];

      setSearchResults((prev) => [...prev, ...newMappedResults]);
      setPage(nextPage);

      setCanLoadMore(responseData?.pageInfo?.hasNextPage ?? rawResults.length >= 20);
    } catch (error) {
      console.error("Load more failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    searchResults,
    isSearching,
    loading,
    viewTitle,
    canLoadMore,
    currentFilters,
    // Section data (API-loaded)
    trendingAnime,
    popularSeason,
    upcomingNext,
    allTimePopular,
    sectionsLoading,
    // Actions
    handleSearch,
    handleBackToHome,
    handleViewAllClick,
    handleLoadMore
  };
};