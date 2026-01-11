var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useMemo, useCallback } from 'react';
import { userService } from '../../../../services/user.service';
import { animeService } from '../../../../services/anime.service';
export const useAddAnimeModal = (isOpen, currentList = []) => {
    const [userData, setUserData] = useState(null);
    const [globalResults, setGlobalResults] = useState([]);
    const [isGlobalSearch, setIsGlobalSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [addingIds, setAddingIds] = useState([]);
    const [addedIds, setAddedIds] = useState([]);
    const statusKeys = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];
    // Logic lấy ID cho danh sách hiện tại (currentList)
    const existingIds = useMemo(() => {
        const ids = new Set();
        if (currentList && Array.isArray(currentList)) {
            currentList.forEach(anime => {
                var _a;
                const rawId = anime.anilist_id || ((_a = anime.media) === null || _a === void 0 ? void 0 : _a.id) || anime.id;
                if (rawId)
                    ids.add(String(rawId));
            });
        }
        return ids;
    }, [currentList]);
    // Hàm Map data chuẩn hóa
    const mapAnimeData = useCallback((rawItem) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const correctId = rawItem.anilist_id || ((_a = rawItem.media) === null || _a === void 0 ? void 0 : _a.id) || rawItem.id;
        return Object.assign(Object.assign({}, rawItem), { id: String(correctId), anilist_id: rawItem.anilist_id || correctId, title_romaji: rawItem.romaji || rawItem.title_romaji || rawItem.name_romaji || ((_c = (_b = rawItem.media) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c.romaji), title_english: rawItem.title_english || ((_d = rawItem.title) === null || _d === void 0 ? void 0 : _d.english) || rawItem.name_english || ((_f = (_e = rawItem.media) === null || _e === void 0 ? void 0 : _e.title) === null || _f === void 0 ? void 0 : _f.english), cover_image: rawItem.cover_image || ((_g = rawItem.coverImage) === null || _g === void 0 ? void 0 : _g.large) || rawItem.cover || ((_j = (_h = rawItem.media) === null || _h === void 0 ? void 0 : _h.coverImage) === null || _j === void 0 ? void 0 : _j.large), episodes: rawItem.episodes || rawItem.airing_episodes || ((_k = rawItem.media) === null || _k === void 0 ? void 0 : _k.episodes), average_score: rawItem.averageScore || rawItem.average_score || ((_l = rawItem.media) === null || _l === void 0 ? void 0 : _l.averageScore), season: rawItem.season || ((_m = rawItem.media) === null || _m === void 0 ? void 0 : _m.season) });
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
        }
        else {
            // Reset state khi đóng modal
            setAddingIds([]);
            setAddedIds([]);
            setSearchTerm('');
            setIsGlobalSearch(false);
            setGlobalResults([]);
        }
    }, [isOpen]);
    // Handler: Search action
    const handleSearchAction = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!searchTerm || searchTerm.trim() === '') {
            setIsGlobalSearch(false);
            return;
        }
        setLoading(true);
        setIsGlobalSearch(true);
        try {
            const response = yield animeService.searchByName(searchTerm);
            const rawCandidates = response.data.candidates || [];
            const mappedResults = rawCandidates.map(mapAnimeData);
            setGlobalResults(mappedResults);
        }
        catch (error) {
            console.error("Search failed in modal:", error);
            setGlobalResults([]);
        }
        finally {
            setLoading(false);
        }
    }), [searchTerm, mapAnimeData]);
    // Handler: Input change
    const handleInputChange = useCallback((value) => {
        setSearchTerm(value);
        if (value === '') {
            setIsGlobalSearch(false);
        }
    }, []);
    // Handler: Add anime click
    const handleAddClick = useCallback((anime, onAddAnime) => __awaiter(void 0, void 0, void 0, function* () {
        const animeIdStr = String(anime.id);
        if (addingIds.includes(animeIdStr) || addedIds.includes(animeIdStr) || existingIds.has(animeIdStr)) {
            return;
        }
        setAddingIds(prev => [...prev, animeIdStr]);
        try {
            yield onAddAnime(anime);
            setAddedIds(prev => [...prev, animeIdStr]);
        }
        catch (error) {
            console.error("Add failed in modal", error);
            throw error;
        }
        finally {
            setAddingIds(prev => prev.filter(id => id !== animeIdStr));
        }
    }), [addingIds, addedIds, existingIds]);
    // Utility: Format status title
    const formatStatusTitle = useCallback((status) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }, []);
    // Check anime state
    const getAnimeState = useCallback((animeIdStr) => {
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
//# sourceMappingURL=useaddAnimeModal.js.map