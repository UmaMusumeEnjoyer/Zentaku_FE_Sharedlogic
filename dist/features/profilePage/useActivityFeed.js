var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/pages/profile/hooks/useActivityFeed.ts
import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
export const useActivityFeed = (username, filterDate) => {
    const [activities, setActivities] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            setLoading(true);
            try {
                const res = yield userService.getUserActivity(username);
                setActivities(res.data.items || []);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        });
        if (username)
            fetchData();
    }, [username]);
    const filteredItems = filterDate
        ? activities.filter(item => {
            const actionDate = new Date(Date.now() - item.ago_seconds * 1000);
            return actionDate.toISOString().split('T')[0] === filterDate;
        })
        : activities;
    const displayItems = filteredItems.slice(0, visibleCount);
    const loadMore = () => setVisibleCount(prev => prev + 10);
    return { displayItems, loading, hasMore: visibleCount < filteredItems.length, loadMore, isEmpty: filteredItems.length === 0 };
};
//# sourceMappingURL=useActivityFeed.js.map