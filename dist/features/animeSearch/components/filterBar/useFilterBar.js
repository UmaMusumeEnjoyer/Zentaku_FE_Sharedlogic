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
export const useFilterBar = ({ onSearch, activeFilters }) => {
    const [filters, setFilters] = useState({
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
            setFilters((prev) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return ({
                    keyword: (_a = activeFilters.keyword) !== null && _a !== void 0 ? _a : prev.keyword,
                    genre: (_c = (_b = activeFilters.filters.genre) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : prev.genre,
                    year: (_e = (_d = activeFilters.filters.year) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : prev.year,
                    season: (_f = activeFilters.filters.season) !== null && _f !== void 0 ? _f : prev.season,
                    format: (_g = activeFilters.filters.format) !== null && _g !== void 0 ? _g : prev.format,
                    status: (_h = activeFilters.filters.status) !== null && _h !== void 0 ? _h : prev.status,
                    sort: (_j = activeFilters.filters.sort) !== null && _j !== void 0 ? _j : prev.sort,
                });
            });
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
        const resetFilters = {
            keyword: '',
            genre: 'Any',
            year: 'Any',
            season: 'Any',
            format: 'Any',
            status: 'Any',
            sort: 'POPULARITY_DESC'
        };
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