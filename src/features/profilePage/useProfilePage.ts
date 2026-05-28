import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../authPage/useAuth';
import { userService } from '../../services/user.service';
import { listService } from '../../services/list.service';
import { SharedConfig } from '../../api/config';
import { UserProfile_ProfilePage, CustomList, NewListData } from './ProfilePage.types';

// Constants
const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZjpoc6BcEHSBXN83B8niRWSjcbNE-DArpg&s";

export interface UseProfilePageCallbacks {
  onNavigateToUserProfile: (username: string) => void;
  onNavigateToList: (listId: string | number, listData?: CustomList) => void;
}

export const useProfilePage = (
  routeUsername?: string,
  callbacks?: UseProfilePageCallbacks
) => {
  const { updateUserInState } = useAuth();

  const loggedInUsername = localStorage.getItem('username');

  // --- 1. IDENTIFY TARGET USER ---
  const targetUsername = routeUsername || loggedInUsername || "guest";
  const isOwnProfile = !routeUsername || (routeUsername === loggedInUsername);

  // --- 2. STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('Overview');

  // Profile Data
  const [userProfile, setUserProfile] = useState<UserProfile_ProfilePage | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Lists Data
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [likedLists, setLikedLists] = useState<CustomList[]>([]);
  const [likedListsLoading, setLikedListsLoading] = useState(false);

  // Favorites & Activity Data
  const [favoriteList, setFavoriteList] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [totalContributions, setTotalContributions] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Social Data
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // Create List Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListData, setNewListData] = useState<NewListData>({
    list_name: '', description: '', is_private: false, color: '#3db4f2'
  });
  const [creating, setCreating] = useState(false);

  // --- 3. HELPER FUNCTIONS ---
  const getAvatarUrl = useCallback((url?: string | null) => {
    if (!url) {
      return DEFAULT_AVATAR;
    }

    // Nếu url bắt đầu bằng /uploads thì để trình duyệt gọi relative path, Vite Proxy sẽ proxy tới BE.
    if (url.startsWith('/uploads')) {
      return url;
    }

    if (url.startsWith('http')) {
      return url;
    }

    const finalUrl = `${SharedConfig.VITE_BACKEND_DOMAIN}${url}`;
    return finalUrl;
  }, []);

  const getDisplayName = useCallback(() => {
    if (!userProfile) return targetUsername;
    const fullName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    return fullName || userProfile.username;
  }, [userProfile, targetUsername]);

  const formatDateJoined = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // --- 4. API EFFECTS ---

  // Fetch User Profile
  useEffect(() => {
    if (!targetUsername) return;

    setProfileLoading(true);
    const profilePromise = isOwnProfile 
      ? userService.getMyProfile() 
      : userService.getUserProfile(targetUsername);

    profilePromise
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => console.error("Failed to fetch profile:", err))
      .finally(() => setProfileLoading(false));
  }, [targetUsername, isOwnProfile]);

  // Fetch Lists (Custom & Liked)
  const fetchCustomLists = useCallback(() => {
    if (!targetUsername) return;
    setListsLoading(true);
    listService.getUserLists(targetUsername)
      .then((res) => {
        const rawLists = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.lists || []);
        const mappedLists = rawLists.map((l: any) => ({
          ...l,
          list_id: l.list_id || l.id,
          list_name: l.list_name || l.name,
          is_private: l.is_private !== undefined ? l.is_private : (l.privacy === 'PRIVATE' || l.privacy === 'private')
        }));
        setCustomLists(mappedLists);
      })
      .catch((err) => console.error(err))
      .finally(() => setListsLoading(false));
  }, [targetUsername]);

  const fetchLikedLists = useCallback(async () => {
    if (!targetUsername) return;
    setLikedListsLoading(true);
    try {
      const payload = { username: targetUsername, limit: 20, offset: 0 };
      const res = await listService.getListsLikedByUser(payload);
      const rawLikedLists = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.liked_lists || []);
      const mappedLikedLists = rawLikedLists.map((l: any) => ({
        ...l,
        list_id: l.list_id || l.id || l.list?.id,
        list_name: l.list_name || l.name || l.list?.name,
        is_private: l.is_private !== undefined ? l.is_private : (l.privacy === 'PRIVATE' || l.privacy === 'private' || l.list?.privacy === 'PRIVATE'),
        like_count: l.like_count !== undefined ? l.like_count : (l.likeCount || l.list?.likeCount || 0)
      }));
      setLikedLists(mappedLikedLists);
    } catch (error) {
      console.error("Failed to fetch liked lists:", error);
      setLikedLists([]);
    } finally {
      setLikedListsLoading(false);
    }
  }, [targetUsername]);

  // Fetch Favorites
  useEffect(() => {
    if (activeTab === 'Favorites' && targetUsername) {
      const fetchFavorites = async () => {
        setFavLoading(true);
        try {
          const res = await userService.getUserAnimeList(targetUsername);
          const data = res.data;
          const allAnime = [
            ...(data.watching || []), ...(data.completed || []),
            ...(data.on_hold || []), ...(data.dropped || []), ...(data.plan_to_watch || [])
          ];
          setFavoriteList(allAnime.filter((anime: any) => anime.isFavorite === true));
        } catch (err) {
          console.error("Failed to fetch favorites:", err);
          setFavoriteList([]);
        } finally {
          setFavLoading(false);
        }
      };
      fetchFavorites();
    }
  }, [activeTab, targetUsername]);

  // Fetch Follow Status independently for Sidebar
  const fetchFollowStatus = useCallback(async () => {
    if (!userProfile?.id || isOwnProfile) return;
    try {
      const res = await userService.checkUserFollow(userProfile.id);
      setIsFollowing(res.data?.isFollowed || false);
    } catch (error) {
      console.error("Failed to fetch follow status:", error);
      setIsFollowing(false);
    }
  }, [userProfile?.id, isOwnProfile]);

  useEffect(() => {
    if (userProfile?.id && !isOwnProfile) {
      fetchFollowStatus();
    }
  }, [fetchFollowStatus, userProfile?.id, isOwnProfile]);

  // Fetch Social Data (For Social Tab)
  const fetchSocialData = useCallback(async () => {
    if (!userProfile?.id) return;
    setSocialLoading(true);
    try {
      const [followersRes, followingRes] = await Promise.all([
        userService.getUserFollowers(userProfile.id),
        userService.getUserFollowing(userProfile.id)
      ]);
      setFollowers(followersRes.data?.data || []);
      setFollowing(followingRes.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch social data:", error);
      setFollowers([]);
      setFollowing([]);
    } finally {
      setSocialLoading(false);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    if (userProfile?.id) {
      fetchSocialData();
    }
  }, [fetchSocialData, userProfile?.id]);

  // Load Initial Data based on Tab
  useEffect(() => {
    if (activeTab === 'Anime List') {
      fetchCustomLists();
      if (isOwnProfile) fetchLikedLists();
    }
    setSelectedDate(null);
  }, [activeTab, fetchCustomLists, fetchLikedLists, isOwnProfile]);

  const handleUpdateSuccess = (updatedUser: UserProfile_ProfilePage) => {


    const oldUsername = userProfile?.username;
    const newUsername = updatedUser.username;


    // ✅ 1. Cập nhật localStorage NGAY LẬP TỨC (quan trọng nhất!)
    if (newUsername) {
      localStorage.setItem('username', newUsername);
    }

    // ✅ 2. Cập nhật state local (UI phản ánh ngay lập tức)
    setUserProfile(prev => {
      if (!prev) return updatedUser;

      // Merge đầy đủ data, đảm bảo không mất field nào
      const merged = {
        ...prev,
        ...updatedUser,
        // Đảm bảo các field quan trọng không bị undefined
        avatar_url: updatedUser.avatar_url ?? prev.avatar_url,
        date_joined: updatedUser.date_joined ?? prev.date_joined,
        is_staff: updatedUser.is_staff ?? prev.is_staff,
      };

      return merged;
    });

    // ✅ 3. Cập nhật AuthContext (Header và các component khác)
    const usernameToFetch = newUsername || oldUsername;

    if (usernameToFetch) {
      userService.getMyProfile()
        .then((res) => {

          // Cập nhật cả local state và AuthContext
          setUserProfile(res.data);
          updateUserInState(res.data);


        })
        .catch((err) => {
          console.error("Failed to refresh user info:", err);
          // Fallback: update với data hiện tại

          // Fallback: update với data hiện tại
          updateUserInState(updatedUser);
        });
    }


    // ✅ 4. Nếu username thay đổi → navigate và re-fetch
    if (oldUsername && newUsername && oldUsername !== newUsername) {



      // Navigate to new profile URL
      if (callbacks?.onNavigateToUserProfile) {
        callbacks.onNavigateToUserProfile(newUsername);
      }

      // Re-fetch profile để đảm bảo data đồng bộ hoàn toàn
      setTimeout(() => {
        userService.getMyProfile()
          .then((res) => {

            setUserProfile(res.data);
            updateUserInState(res.data);
          })

      }, 100); // Small delay để đảm bảo localStorage đã update
    }
  };

  const handleTabChange = (tabName: string) => setActiveTab(tabName);

  const handleDateSelect = (date: string) => {
    setSelectedDate(prev => prev === date ? null : date);
  };

  const handleCreateListSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await listService.create(newListData);
      setShowCreateModal(false);
      setNewListData({ list_name: '', description: '', is_private: false, color: '#3db4f2' });
      fetchCustomLists(); // Reload list
    } catch (error) {
      alert("Error creating list.");
    } finally {
      setCreating(false);
    }
  };

  const handleNewListInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setNewListData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleListClick = (list: CustomList) => {
    callbacks?.onNavigateToList(list.list_id, list);
  };

  const toggleFollow = async () => {
    if (!userProfile?.id) return;
    const targetId = userProfile.id;
    
    // Optimistic Update
    setIsFollowing(prev => !prev);
    
    try {
      if (isFollowing) {
        await userService.unfollowUser(targetId);
      } else {
        await userService.followUser(targetId);
      }
      // Re-fetch to guarantee accuracy
      fetchFollowStatus();
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
      // Revert optimistic update
      setIsFollowing(prev => !prev);
    }
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
    handleNewListInputChange,

    // Social Follow
    followers,
    following,
    isFollowing,
    socialLoading,
    toggleFollow
  };
};