var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../authPage/useAuth';
import { userService } from '../../services/user.service';
import { listService } from '../../services/list.service';
import { SharedConfig } from '../../api/config';
// Constants
const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZjpoc6BcEHSBXN83B8niRWSjcbNE-DArpg&s";
export const useProfilePage = (routeUsername, callbacks) => {
    const { updateUserInState } = useAuth();
    const loggedInUsername = localStorage.getItem('username');
    // --- 1. IDENTIFY TARGET USER ---
    const targetUsername = routeUsername || loggedInUsername || "guest";
    const isOwnProfile = !routeUsername || (routeUsername === loggedInUsername);
    // --- 2. STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('Overview');
    // Profile Data
    const [userProfile, setUserProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    // Lists Data
    const [customLists, setCustomLists] = useState([]);
    const [listsLoading, setListsLoading] = useState(false);
    const [likedLists, setLikedLists] = useState([]);
    const [likedListsLoading, setLikedListsLoading] = useState(false);
    // Favorites & Activity Data
    const [favoriteList, setFavoriteList] = useState([]);
    const [favLoading, setFavLoading] = useState(false);
    const [totalContributions, setTotalContributions] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    // Create List Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newListData, setNewListData] = useState({
        list_name: '', description: '', is_private: false, color: '#3db4f2'
    });
    const [creating, setCreating] = useState(false);
    // --- 3. HELPER FUNCTIONS ---
    const getAvatarUrl = useCallback((url) => {
        if (!url) {
            return DEFAULT_AVATAR;
        }
        const finalUrl = `${SharedConfig.VITE_BACKEND_DOMAIN}${url}`;
        return finalUrl;
    }, []);
    const getDisplayName = useCallback(() => {
        if (!userProfile)
            return targetUsername;
        const fullName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
        return fullName || userProfile.username;
    }, [userProfile, targetUsername]);
    const formatDateJoined = (dateString) => {
        if (!dateString)
            return '';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    // --- 4. API EFFECTS ---
    // Fetch User Profile
    useEffect(() => {
        if (!targetUsername)
            return;
        setProfileLoading(true);
        userService.getUserProfile(targetUsername)
            .then((res) => {
            setUserProfile(res.data);
        })
            .catch((err) => console.error("Failed to fetch profile:", err))
            .finally(() => setProfileLoading(false));
    }, [targetUsername]);
    // Fetch Lists (Custom & Liked)
    const fetchCustomLists = useCallback(() => {
        if (!targetUsername)
            return;
        setListsLoading(true);
        listService.getUserLists(targetUsername)
            .then((res) => { var _a; return setCustomLists(((_a = res.data) === null || _a === void 0 ? void 0 : _a.lists) || []); })
            .catch((err) => console.error(err))
            .finally(() => setListsLoading(false));
    }, [targetUsername]);
    const fetchLikedLists = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!targetUsername)
            return;
        setLikedListsLoading(true);
        try {
            const payload = { username: targetUsername, limit: 20, offset: 0 };
            const res = yield listService.getListsLikedByUser(payload);
            setLikedLists(((_a = res.data) === null || _a === void 0 ? void 0 : _a.liked_lists) || []);
        }
        catch (error) {
            console.error("Failed to fetch liked lists:", error);
            setLikedLists([]);
        }
        finally {
            setLikedListsLoading(false);
        }
    }), [targetUsername]);
    // Fetch Favorites
    useEffect(() => {
        if (activeTab === 'Favorites' && targetUsername) {
            const fetchFavorites = () => __awaiter(void 0, void 0, void 0, function* () {
                setFavLoading(true);
                try {
                    const res = yield userService.getUserAnimeList(targetUsername);
                    const data = res.data;
                    const allAnime = [
                        ...(data.watching || []), ...(data.completed || []),
                        ...(data.on_hold || []), ...(data.dropped || []), ...(data.plan_to_watch || [])
                    ];
                    setFavoriteList(allAnime.filter((anime) => anime.isFavorite === true));
                }
                catch (err) {
                    console.error("Failed to fetch favorites:", err);
                    setFavoriteList([]);
                }
                finally {
                    setFavLoading(false);
                }
            });
            fetchFavorites();
        }
    }, [activeTab, targetUsername]);
    // Load Initial Data based on Tab
    useEffect(() => {
        if (activeTab === 'Anime List') {
            fetchCustomLists();
            if (isOwnProfile)
                fetchLikedLists();
        }
        setSelectedDate(null);
    }, [activeTab, fetchCustomLists, fetchLikedLists, isOwnProfile]);
    const handleUpdateSuccess = (updatedUser) => {
        console.log('🔥 handleUpdateSuccess called with:', updatedUser);
        const oldUsername = userProfile === null || userProfile === void 0 ? void 0 : userProfile.username;
        const newUsername = updatedUser.username;
        // ✅ 1. Cập nhật localStorage NGAY LẬP TỨC (quan trọng nhất!)
        if (newUsername) {
            localStorage.setItem('username', newUsername);
        }
        // ✅ 2. Cập nhật state local (UI phản ánh ngay lập tức)
        setUserProfile(prev => {
            var _a, _b, _c;
            if (!prev)
                return updatedUser;
            // Merge đầy đủ data, đảm bảo không mất field nào
            const merged = Object.assign(Object.assign(Object.assign({}, prev), updatedUser), { 
                // Đảm bảo các field quan trọng không bị undefined
                avatar_url: (_a = updatedUser.avatar_url) !== null && _a !== void 0 ? _a : prev.avatar_url, date_joined: (_b = updatedUser.date_joined) !== null && _b !== void 0 ? _b : prev.date_joined, is_staff: (_c = updatedUser.is_staff) !== null && _c !== void 0 ? _c : prev.is_staff });
            console.log('📝 Merged profile state:', merged);
            return merged;
        });
        // ✅ 3. Cập nhật AuthContext (Header và các component khác)
        const usernameToFetch = newUsername || oldUsername;
        console.log('🔄 Fetching user profile for:', usernameToFetch);
        if (usernameToFetch) {
            userService.getUserProfile(usernameToFetch)
                .then((res) => {
                console.log('✅ Fetched user data:', res.data);
                console.log('🎯 Calling updateUserInState with:', res.data);
                // Cập nhật cả local state và AuthContext
                setUserProfile(res.data);
                updateUserInState(res.data);
                console.log('✅ updateUserInState called successfully');
            })
                .catch((err) => {
                console.error("Failed to refresh user info:", err);
                // Fallback: update với data hiện tại
                console.log('⚠️ Fallback: updating with current data');
                // Fallback: update với data hiện tại
                updateUserInState(updatedUser);
            });
        }
        // ✅ 4. Nếu username thay đổi → navigate và re-fetch
        if (oldUsername && newUsername && oldUsername !== newUsername) {
            console.log('🔀 Username changed, navigating...');
            // Navigate to new profile URL
            if (callbacks === null || callbacks === void 0 ? void 0 : callbacks.onNavigateToUserProfile) {
                callbacks.onNavigateToUserProfile(newUsername);
            }
            // Re-fetch profile để đảm bảo data đồng bộ hoàn toàn
            setTimeout(() => {
                userService.getUserProfile(newUsername)
                    .then((res) => {
                    setUserProfile(res.data);
                    updateUserInState(res.data);
                });
            }, 100); // Small delay để đảm bảo localStorage đã update
        }
    };
    const handleTabChange = (tabName) => setActiveTab(tabName);
    const handleDateSelect = (date) => {
        setSelectedDate(prev => prev === date ? null : date);
    };
    const handleCreateListSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setCreating(true);
        try {
            yield listService.create(newListData);
            setShowCreateModal(false);
            setNewListData({ list_name: '', description: '', is_private: false, color: '#3db4f2' });
            fetchCustomLists(); // Reload list
        }
        catch (error) {
            alert("Error creating list.");
        }
        finally {
            setCreating(false);
        }
    });
    const handleNewListInputChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setNewListData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'checkbox' ? checked : value })));
    };
    const handleListClick = (list) => {
        callbacks === null || callbacks === void 0 ? void 0 : callbacks.onNavigateToList(list.list_id, list);
    };
    return {
        // Info
        targetUsername,
        isOwnProfile,
        userProfile,
        profileLoading,
        getDisplayName,
        getAvatarUrl,
        formatDateJoined,
        // Tabs
        activeTab,
        handleTabChange,
        // Activity
        totalContributions,
        setTotalContributions,
        selectedDate,
        handleDateSelect,
        // Lists
        customLists,
        listsLoading,
        likedLists,
        likedListsLoading,
        handleListClick,
        // Favorites
        favoriteList,
        favLoading,
        // Modals & Actions
        showEditModal,
        setShowEditModal,
        handleUpdateSuccess,
        // Create List Form
        showCreateModal,
        setShowCreateModal,
        newListData,
        creating,
        handleCreateListSubmit,
        handleNewListInputChange
    };
};
//# sourceMappingURL=useProfilePage.js.map