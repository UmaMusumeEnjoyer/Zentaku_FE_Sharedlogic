import { FilterState, ActiveFilters, FilterKey } from './filter.types';
interface UseFilterBarProps {
    onSearch?: (keyword: string, filters: Omit<FilterState, 'keyword'>) => void;
    activeFilters?: ActiveFilters;
}
export declare const useFilterBar: ({ onSearch, activeFilters }: UseFilterBarProps) => {
    filters: FilterState;
    handleSearchAction: () => void;
    handleInputChange: (value: string) => void;
    handleFilterChange: (key: FilterKey, value: string) => void;
    handleClear: () => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};
export {};
//# sourceMappingURL=useFilterBar.d.ts.map