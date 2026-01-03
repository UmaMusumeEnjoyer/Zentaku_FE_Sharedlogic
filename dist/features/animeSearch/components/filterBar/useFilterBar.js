// src/pages/AnimeSearch/hooks/useFilterBar.ts
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useState, useEffect } from 'react';
import { DEFAULT_FILTER_VALUES } from './filter.data';
export const useFilterBar = ({ onSearch, activeFilters }) => {
    const [filters, setFilters] = useState(Object.assign({}, DEFAULT_FILTER_VALUES));
    // Sync with active filters from parent
    useEffect(() => {
        if (activeFilters) {
            setFilters((prev) => ({
                keyword: activeFilters.keyword || prev.keyword,
                genre: activeFilters.filters.genre || prev.genre,
                year: activeFilters.filters.year || prev.year,
                season: activeFilters.filters.season || prev.season,
                format: activeFilters.filters.format || prev.format,
                status: activeFilters.filters.status || prev.status,
                sort: activeFilters.filters.sort || prev.sort,
            }));
        }
    }, [activeFilters]);
    const triggerSearch = (keyword, filterState) => {
        if (onSearch) {
            onSearch(keyword, filterState);
        }
    };
    const handleSearchAction = () => {
        const { keyword } = filters, rest = __rest(filters, ["keyword"]);
        triggerSearch(keyword, rest);
    };
    const handleInputChange = (value) => {
        setFilters((prev) => (Object.assign(Object.assign({}, prev), { keyword: value })));
        // If empty, trigger search immediately
        if (value === '') {
            const { keyword } = filters, rest = __rest(filters, ["keyword"]);
            triggerSearch('', rest);
        }
    };
    const handleFilterChange = (key, value) => {
        setFilters((prev) => {
            const updated = Object.assign(Object.assign({}, prev), { [key]: value });
            const { keyword } = updated, rest = __rest(updated, ["keyword"]);
            triggerSearch(keyword, rest);
            return updated;
        });
    };
    const handleClear = () => {
        const resetFilters = Object.assign({}, DEFAULT_FILTER_VALUES);
        setFilters(resetFilters);
        const { keyword } = resetFilters, rest = __rest(resetFilters, ["keyword"]);
        triggerSearch(keyword, rest);
    };
    const handleKeyDown = (e) => {
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
//# sourceMappingURL=useFilterBar.js.map