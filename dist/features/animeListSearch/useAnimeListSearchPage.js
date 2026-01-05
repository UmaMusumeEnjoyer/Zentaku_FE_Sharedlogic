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
import { listService } from '../../services/list.service';
export const useAnimeListSearchPage = () => {
    // --- STATE: TOP LISTS (DEFAULT) ---
    const [topLists, setTopLists] = useState([]);
    const [loadingTop, setLoadingTop] = useState(true);
    // --- STATE: SEARCH RESULTS ---
    const [searchResults, setSearchResults] = useState([]);
    const [searchMetadata, setSearchMetadata] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    // --- EFFECT: FETCH TOP LISTS ON MOUNT ---
    useEffect(() => {
        const fetchTopLists = () => __awaiter(void 0, void 0, void 0, function* () {
            setLoadingTop(true);
            try {
                const response = yield listService.getMostLikedLists();
                if (response.data && response.data.most_liked_lists) {
                    setTopLists(response.data.most_liked_lists);
                }
            }
            catch (error) {
                console.error("Error fetching most liked lists:", error);
            }
            finally {
                setLoadingTop(false);
            }
        });
        fetchTopLists();
    }, []);
    // --- HANDLER: SEARCH ---
    const handleSearch = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
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
            const response = yield listService.searchCustomLists(keyword);
            // Response structure: { data: { query: "...", lists: [...], total: 1, ... } }
            if (response.data && response.data.lists) {
                setSearchResults(response.data.lists);
                setSearchMetadata({
                    total: response.data.total,
                    showing: response.data.showing
                });
            }
            else {
                setSearchResults([]);
                setSearchMetadata({ total: 0, showing: 0 });
            }
        }
        catch (error) {
            console.error("Error searching lists:", error);
            setSearchResults([]);
        }
        finally {
            setLoadingSearch(false);
        }
    });
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
//# sourceMappingURL=useAnimeListSearchPage.js.map