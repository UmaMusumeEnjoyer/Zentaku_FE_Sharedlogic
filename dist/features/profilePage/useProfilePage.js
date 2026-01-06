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
    // --- 5. HANDLERS ---
    const handleUpdateSuccess = (updatedUser) => {
        if (userProfile && updatedUser.username !== userProfile.username) {
            localStorage.setItem('username', updatedUser.username);
            callbacks === null || callbacks === void 0 ? void 0 : callbacks.onNavigateToUserProfile(updatedUser.username);
        }
        else {
            setUserProfile(prev => prev ? (Object.assign(Object.assign({}, prev), updatedUser)) : updatedUser);
        }
        updateUserInState(updatedUser);
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