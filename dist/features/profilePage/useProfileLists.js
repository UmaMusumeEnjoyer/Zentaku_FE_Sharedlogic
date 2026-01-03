var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/pages/profile/hooks/useProfileLists.ts
import { useState, useEffect } from 'react';
import { listService } from '../../services/list.service';
export const useProfileLists = (username, isOwnProfile) => {
    const [customLists, setCustomLists] = useState([]);
    const [likedLists, setLikedLists] = useState([]);
    const [loading, setLoading] = useState(false);
    // Fetch data khi hook được gọi (tức là khi Component Tab được mount)
    useEffect(() => {
        if (!username)
            return;
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            setLoading(true);
            try {
                const customRes = yield listService.getUserLists(username);
                setCustomLists(((_a = customRes.data) === null || _a === void 0 ? void 0 : _a.lists) || []);
                if (isOwnProfile) {
                    const likedRes = yield listService.getListsLikedByUser({ username, limit: 20, offset: 0 });
                    setLikedLists(((_b = likedRes.data) === null || _b === void 0 ? void 0 : _b.liked_lists) || []);
                }
            }
            catch (error) {
                console.error("Error fetching lists", error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchData();
    }, [username, isOwnProfile]);
    const createList = (listData) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield listService.create(listData);
        // Refresh custom lists logic here usually re-fetches or appends local state
        const res = yield listService.getUserLists(username);
        setCustomLists(((_a = res.data) === null || _a === void 0 ? void 0 : _a.lists) || []);
    });
    return { customLists, likedLists, loading, createList };
};
//# sourceMappingURL=useProfileLists.js.map