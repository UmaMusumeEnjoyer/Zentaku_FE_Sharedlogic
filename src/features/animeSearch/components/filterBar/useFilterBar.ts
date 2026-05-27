// src/pages/AnimeSearch/hooks/useFilterBar.ts

import { useState, useEffect } from 'react';
import { FilterState, ActiveFilters, FilterKey } from './filter.types';
import { DEFAULT_FILTER_VALUES } from './filter.data';

interface UseFilterBarProps {
  onSearch?: (keyword: string, filters: Omit<FilterState, 'keyword'>) => void;
  activeFilters?: ActiveFilters;
}

export const useFilterBar = ({ onSearch, activeFilters }: UseFilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>({ 
    keyword: '',
    genre: 'Any',
    year: 'Any',
    season: 'Any',
    format: 'Any',
    status: 'Any',
    sort: 'POPULARITY_DESC'
  });

  // Sync with active filters from parent
  useEffect(() => {
    if (activeFilters) {
      setFilters((prev) => ({
        keyword: activeFilters.keyword ?? prev.keyword,
        genre: activeFilters.filters.genre?.toString() ?? prev.genre,
        year: activeFilters.filters.year?.toString() ?? prev.year,
        season: activeFilters.filters.season ?? prev.season,
        format: activeFilters.filters.format ?? prev.format,
        status: activeFilters.filters.status ?? prev.status,
        sort: activeFilters.filters.sort ?? prev.sort,
      }));
    }
  }, [activeFilters]);

  const triggerSearch = (keyword: string, filterState: Omit<FilterState, 'keyword'>) => {
    if (onSearch) {
      onSearch(keyword, filterState);
    }
  };

  const handleSearchAction = () => {
    const { keyword, ...rest } = filters;
    triggerSearch(keyword, rest);
  };

  const handleInputChange = (value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
    
    // If empty, trigger search immediately
    if (value === '') {
      const { keyword, ...rest } = filters;
      triggerSearch('', rest);
    }
  };

  const handleFilterChange = (key: FilterKey, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters((prev) => ({ ...prev, [key]: value }));
    
    const { keyword, ...rest } = updated;
    triggerSearch(keyword, rest);
  };

  const handleClear = () => {
    const resetFilters: FilterState = {
      keyword: '',
      genre: 'Any',
      year: 'Any',
      season: 'Any',
      format: 'Any',
      status: 'Any',
      sort: 'POPULARITY_DESC'
    };
    setFilters(resetFilters);
    
    const { keyword, ...rest } = resetFilters;
    triggerSearch(keyword, rest);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchAction();
    }
  };

  return {
    filters,
    handleSearchAction,
    handleInputChange,
    handleFilterChange,
    handleClear,
    handleKeyDown,
  };
};