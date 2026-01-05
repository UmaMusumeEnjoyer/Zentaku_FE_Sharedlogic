import { useState, useEffect } from 'react';
import { AnimeListItem, SearchMetadata } from './AnimeListSearchPage.types';
import { listService } from '../../services/list.service';

export const useAnimeListSearchPage = () => {
  // --- STATE: TOP LISTS (DEFAULT) ---
  const [topLists, setTopLists] = useState<AnimeListItem[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);

  // --- STATE: SEARCH RESULTS ---
  const [searchResults, setSearchResults] = useState<AnimeListItem[]>([]);
  const [searchMetadata, setSearchMetadata] = useState<SearchMetadata | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // --- EFFECT: FETCH TOP LISTS ON MOUNT ---
  useEffect(() => {
    const fetchTopLists = async () => {
      setLoadingTop(true);
      try {
        const response = await listService.getMostLikedLists();
        if (response.data && response.data.most_liked_lists) {
          setTopLists(response.data.most_liked_lists);
        }
      } catch (error) {
        console.error("Error fetching most liked lists:", error);
      } finally {
        setLoadingTop(false);
      }
    };

    fetchTopLists();
  }, []);

  // --- HANDLER: SEARCH ---
  const handleSearch = async (keyword: string) => {
    // Nếu keyword rỗng, quay về chế độ hiển thị Top Lists
    if (!keyword || keyword.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      setSearchMetadata(null);
      return;
    }

    console.log("Searching for lists:", keyword);
    setLoadingSearch(true);
    setIsSearching(true); // Bật chế độ search

    try {
      const response = await listService.searchCustomLists(keyword);
      // Response structure: { data: { query: "...", lists: [...], total: 1, ... } }
      
      if (response.data && response.data.lists) {
        setSearchResults(response.data.lists);
        setSearchMetadata({
            total: response.data.total,
            showing: response.data.showing
        });
      } else {
        setSearchResults([]);
        setSearchMetadata({ total: 0, showing: 0 });
      }
    } catch (error) {
      console.error("Error searching lists:", error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  return {
    // Data
    topLists,
    searchResults,
    searchMetadata,
    
    // Status Flags
    loadingTop,
    loadingSearch,
    isSearching,
    
    // Actions
    handleSearch
  };
};