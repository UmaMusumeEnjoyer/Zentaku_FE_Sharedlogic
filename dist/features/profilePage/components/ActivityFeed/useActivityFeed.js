var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useMemo } from 'react';
import { userService } from '../../../../services/user.service';
export const useActivityFeed = (filterDate) => {
    const [activities, setActivities] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username');
    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (username) {
                    const res = yield userService.getUserActivity(username);
                    setActivities(res.data.items || []);
                }
            }
            catch (error) {
                console.error("Failed to fetch activities", error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchData();
    }, [username]);
    // --- 2. FILTER & PAGINATION ---
    const filteredItems = useMemo(() => {
        if (!filterDate)
            return activities;
        return activities.filter(item => {
            // Tính toán ngày dựa trên ago_seconds
            const actionDate = new Date(Date.now() - item.ago_seconds * 1000);
            const actionDateStr = actionDate.toISOString().split('T')[0];
            return actionDateStr === filterDate;
        });
    }, [activities, filterDate]);
    const displayItems = filteredItems.slice(0, visibleCount);
    const canLoadMore = visibleCount < filteredItems.length;
    const handleLoadMore = () => setVisibleCount(prev => prev + 10);
    // --- 3. HELPER FUNCTIONS (Logic hiển thị) ---
    const formatTimeAgo = (s) => {
        if (s < 60)
            return 'now';
        if (s < 3600)
            return `${Math.floor(s / 60)}m ago`;
        if (s < 86400)
            return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };
    const getActionClass = (type) => {
        switch (type) {
            case 'followed_anime':
            case 'create_list':
                return 'feed-icon-add';
            case 'updated_followed_anime':
                return 'feed-icon-update';
            default:
                return 'feed-icon-default';
        }
    };
    const getActionIconChar = (type) => {
        if (type === 'create_list')
            return '☰';
        if (type === 'followed_anime')
            return '+';
        if (type.includes('update'))
            return '✎';
        return '•';
    };
    const getActionDescription = (type) => {
        switch (type) {
            case 'followed_anime':
                return 'followed anime';
            case 'create_list':
                return 'created custom list';
            case 'updated_followed_anime':
                return 'updated progress';
            default:
                return 'performed action';
        }
    };
    const getTargetName = (item) => {
        var _a, _b;
        if (item.action_type === 'create_list') {
            return ((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.list_name) || "Unnamed List";
        }
        return ((_b = item.metadata) === null || _b === void 0 ? void 0 : _b.title) || "Unknown Anime";
    };
    // --- 4. NAVIGATION LOGIC ---
    const getTargetUrl = (item) => {
        if (item.action_type === 'create_list') {
            return `/list/${item.target_id}`;
        }
        return `/anime/${item.target_id}`;
    };
    return {
        // Data
        username,
        loading,
        displayItems,
        canLoadMore,
        hasActivity: filteredItems.length > 0,
        // Actions
        handleLoadMore,
        getTargetUrl,
        // Helpers
        formatTimeAgo,
        getActionClass,
        getActionIconChar,
        getActionDescription,
        getTargetName
    };
};
//# sourceMappingURL=useActivityFeed.js.map