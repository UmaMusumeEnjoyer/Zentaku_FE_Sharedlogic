import { useState, useEffect, useMemo, useCallback } from 'react';
import {AnimeItem_addAnimeModal as AnimeItem, UserAnimeData, AnimeStatusKey } from './addAnimeModal.types';
import { userService } from '../../../../services/user.service';
import { animeService } from '../../../../services/anime.service';
import { searchService } from '../../../../services/search.service';

export const useAddAnimeModal = (
  isOpen: boolean,
  currentList: AnimeItem[] = []
) => {
  const [userData, setUserData] = useState<UserAnimeData | null>(null);
  const [globalResults, setGlobalResults] = useState<AnimeItem[]>([]);
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingIds, setAddingIds] = useState<string[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const statusKeys: AnimeStatusKey[] = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];

  // Logic lấy ID cho danh sách hiện tại (currentList)
  const existingIds = useMemo(() => {
    const ids = new Set<string>();
    if (currentList && Array.isArray(currentList)) {
      currentList.forEach(anime => {
        const rawId = anime.anilist_id || anime.media?.id || anime.id;
        if (rawId) ids.add(String(rawId));
      });
    }
    return ids;
  }, [currentList]);

  // Hàm Map data chuẩn hóa
  const mapAnimeData = useCallback((rawItem: any): AnimeItem => {
    const correctId = rawItem.anilist_id || rawItem.media?.id || rawItem.id;
    
    return {
      ...rawItem,
      id: String(correctId),
      anilist_id: rawItem.anilist_id || correctId,
      title_romaji: rawItem.romaji || rawItem.title_romaji || rawItem.name_romaji || rawItem.media?.title?.romaji,
      title_english: rawItem.title_english || rawItem.title?.english || rawItem.name_english || rawItem.media?.title?.english,
      cover_image: rawItem.cover_image || rawItem.coverImage?.large || rawItem.cover || rawItem.media?.coverImage?.large,
      episodes: rawItem.episodes || rawItem.airing_episodes || rawItem.media?.episodes,
      average_score: rawItem.averageScore || rawItem.average_score || rawItem.media?.averageScore,
      season: rawItem.season || rawItem.media?.season,
    };
  }, []);

  // Fetch user anime list khi modal mở
  useEffect(() => {
    if (isOpen) {
      const username = localStorage.getItem("username");
      if (username) {
        setLoading(true);
        userService.getUserAnimeList(username)
          .then(res => {
            setUserData(res.data);
          })
          .catch(err => {
            console.error("Failed to fetch user list", err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      // Reset state khi đóng modal
      setAddingIds([]);
      setAddedIds([]);
      setSearchTerm('');
      setIsGlobalSearch(false);
      setGlobalResults([]);
    }
  }, [isOpen]);

  // Handler: Search action
  const handleSearchAction = useCallback(async () => {
    if (!searchTerm || searchTerm.trim() === '') {
      setIsGlobalSearch(false);
      return;
    }

    setLoading(true);
    setIsGlobalSearch(true);

    try {
      const response = await searchService.searchAnime({ q: searchTerm });
      const rawCandidates = response.data?.data || response.data || [];
      const mappedResults = rawCandidates.map(mapAnimeData);
      setGlobalResults(mappedResults);
    } catch (error) {
      console.error("Search failed in modal:", error);
      setGlobalResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, mapAnimeData]);

  // Handler: Input change
  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (value === '') {
      setIsGlobalSearch(false);
    }
  }, []);

  // Handler: Add anime click
  const handleAddClick = useCallback(async (anime: AnimeItem, onAddAnime: (anime: AnimeItem) => Promise<void>) => {
    const animeIdStr = String(anime.id);

    if (addingIds.includes(animeIdStr) || addedIds.includes(animeIdStr) || existingIds.has(animeIdStr)) {
      return;
    }

    setAddingIds(prev => [...prev, animeIdStr]);

    try {
      await onAddAnime(anime);
      setAddedIds(prev => [...prev, animeIdStr]);
    } catch (error) {
      console.error("Add failed in modal", error);
      throw error;
    } finally {
      setAddingIds(prev => prev.filter(id => id !== animeIdStr));
    }
  }, [addingIds, addedIds, existingIds]);

  // Utility: Format status title
  const formatStatusTitle = useCallback((status: string): string => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, []);

  // Check anime state
  const getAnimeState = useCallback((animeIdStr: string) => {
    const isAdding = addingIds.includes(animeIdStr);
    const isAlreadyInList = existingIds.has(animeIdStr);
    const isAddedSession = addedIds.includes(animeIdStr);
    const isAdded = isAlreadyInList || isAddedSession;

    return { isAdding, isAdded };
  }, [addingIds, addedIds, existingIds]);

  return {
    // State
    userData,
    globalResults,
    isGlobalSearch,
    loading,
    searchTerm,
    statusKeys,
    
    // Computed
    existingIds,
    
    // Methods
    mapAnimeData,
    handleSearchAction,
    handleInputChange,
    handleAddClick,
    formatStatusTitle,
    getAnimeState,
  };
};