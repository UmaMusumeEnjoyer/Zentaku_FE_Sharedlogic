// src/pages/AnimeSearch/types/filter.types.ts

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterState {
  keyword: string;
  genre: string;
  year: string;
  season: string;
  format: string;
  status: string;
  sort: string;
}

export interface ActiveFilters {
  keyword?: string;
  filters: {
    genre?: string;
    year?: string | number;
    season?: string;
    format?: string;
    status?: string;
    sort?: string;
  };
}

export interface FilterBarProps {
  onSearch: (keyword: string, filters: Omit<FilterState, 'keyword'>) => void;
  activeFilters?: ActiveFilters | null;
}

export type FilterKey = keyof Omit<FilterState, 'keyword'>;