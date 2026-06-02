import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { listService } from '../../services/list.service';
import { animeService } from '../../services/anime.service';
import { batchWithLimit } from '../../shared/utils/batchRequests';
import { 
  ListInfo, 
  GroupedAnime, 
  ListMember, 
  ListRequest, 
  RequestType, 
  ModalRoleType,
  AnimeItemDetail 
} from './animeListPage.types';

type ToLocation = string | { pathname?: string; search?: string; hash?: string; state?: any };
type NavigateOptionsLike = { replace?: boolean; state?: any };
interface NavigateLike {
  (to: ToLocation, options?: NavigateOptionsLike): void;
  (delta: number): void;
}

export const useAnimeListPage = (
  listId: string,
  locationState: any,
  onNavigate?: NavigateLike
) => {
  const animeDetailsCache = useRef<Map<number | string, any>>(new Map());
  const isFetchingRef = useRef(false);

  const navigate = useCallback<NavigateLike>(((to: ToLocation | number, options?: NavigateOptionsLike) => {
    if (onNavigate) {
      if (typeof to === 'number') {
        onNavigate(to);
      } else {
        onNavigate(to, options);
      }
      return;
    }

    if (typeof window === 'undefined') return;
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }
    if (typeof to === 'string') {
      window.location.assign(to);
      return;
    }
   if (to && typeof to === 'object' && 'pathname' in to && to.pathname) {
      window.location.assign(`${to.pathname}${to.search || ''}${to.hash || ''}`);
    }
  }) as NavigateLike, [onNavigate]);

  const currentUsername = typeof localStorage !== 'undefined' 
    ? localStorage.getItem("username") 
    : null;
  
  const [currentPermission, setCurrentPermission] = useState<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem("permission_level") : null
  );

  const canEdit = currentPermission === "owner" || currentPermission === "edit";
  const isViewer = currentPermission === "view" || currentPermission === "viewer";

  const [listInfo, setListInfo] = useState<ListInfo>(locationState?.listData || {
    name: "Loading...",
    description: "",
    privacy: 'public',
    color: "#3db4f2",
    isOwner: false
  });

  const [groupedAnime, setGroupedAnime] = useState<GroupedAnime>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [members, setMembers] = useState<ListMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ListRequest[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalRoleType, setModalRoleType] = useState<ModalRoleType>('viewer');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>('join');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedAnimeIds, setSelectedAnimeIds] = useState<(string | number)[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const allAnimeInList = useMemo(() => {
    return Object.values(groupedAnime).flat();
  }, [groupedAnime]);

  const currentUserHasItems = useMemo(() => {
    return currentUsername ? 
      (groupedAnime[currentUsername] && groupedAnime[currentUsername].length > 0) : 
      false;
  }, [groupedAnime, currentUsername]);

  const fetchMembersData = useCallback(async () => {
    if (!listId) return;
    try {
      const res = await listService.getMembers(listId);
      const rawMembers = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.members || []);
      const memberList = rawMembers.map((m: any) => {
        const isOwner = m.isOwner !== undefined ? m.isOwner : !!m.is_owner;
        const permission = m.permission || (
          (m.permission_level === 'owner' || isOwner) ? 'owner' : 
          (m.permission_level === 'edit' || m.permissionLevel === 'EDITOR') ? 'editor' : 'viewer'
        );
        return {
          ...m,
          isOwner,
          permission,
          is_owner: isOwner,
          can_edit: permission === 'owner' || permission === 'editor',
          avatar_url: m.avatar || m.avatar_url
        };
      });
      setMembers(memberList);

      if (currentUsername) {
        const currentUserData = memberList.find((m: ListMember) => m.username === currentUsername);
        if (currentUserData) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem("permission_level", currentUserData.permission || '');
          }
          setCurrentPermission(currentUserData.permission || null);
          setListInfo(prev => ({ ...prev, isOwner: currentUserData.isOwner || false }));
        } else {
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem("permission_level");
          }
          setCurrentPermission(null);
          setListInfo(prev => ({ ...prev, isOwner: false }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch list members:", error);
    }
  }, [listId, currentUsername]);

  const fetchRequestsData = useCallback(async () => {
    if (listInfo.isOwner && listId) {
      try {
        const res = await listService.getListRequests(listId);
        const reqs = res.data.data || res.data.requests || res.data || [];
        const mappedReqs = reqs.map((r: any) => ({
          ...r,
          type: r.requestType ? r.requestType.toLowerCase() : (r.request_type === 'edit_permission' ? 'edit' : 'join'),
          id: r.id || r.request_id
        }));
        setPendingRequests(mappedReqs);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    }
  }, [listInfo.isOwner, listId]);

  const fetchListDetails = useCallback(async () => {
    if (!listId || isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setDeleteMode(false);
    setSelectedAnimeIds([]);

    try {
      const res = await listService.getListDetail(listId);
      const data = res.data.data || res.data;
      const isUserOwner = data.ownerUsername === currentUsername || listInfo.isOwner;
      
      if (isUserOwner && currentUsername) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem("permission_level", "owner");
        }
        setCurrentPermission("owner");
      }

      setListInfo(prev => ({
        ...prev,
        name: data.name || data.list_name || prev.name,
        description: data.description !== undefined ? data.description : prev.description,
        privacy: data.privacy || (data.is_private ? 'private' : 'public') || prev.privacy,
        color: data.color || prev.color,
        bannerImage: data.bannerImage || data.banner_image || prev.bannerImage,
        isOwner: isUserOwner
      }));

      const items = data.animeItems || data.anime_items || [];
      const uniqueIds = Array.from(new Set(items.map((item: any) => item.anilistId || item.anilist_id || item.mediaId))) as (string | number)[];
      const idsToFetch = uniqueIds.filter(id => !animeDetailsCache.current.has(id));

      if (idsToFetch.length > 0) {
        await batchWithLimit(idsToFetch, 5, async (id: any) => {
           try {
             const animeRes = await animeService.getById(id);
             if (animeRes?.data) {
                animeDetailsCache.current.set(id, animeRes.data);
             }
           } catch (err) {
             console.error(`Failed to fetch anime ${id}`, err);
             animeDetailsCache.current.set(id, null);
           }
        });
      }

      const processedAnimeList: any[] = [];
      items.forEach((item: any) => {
        const anilistId = item.anilistId || item.anilist_id || item.mediaId;
        const detail = animeDetailsCache.current.get(anilistId);
        if (detail) {
          const mappedCoverImage = typeof detail.coverImage === 'string'
            ? { large: detail.coverImage }
            : detail.coverImage;

          processedAnimeList.push({
            ...detail,
            id: detail.idAnilist || detail.id || anilistId,
            coverImage: mappedCoverImage,
            _added_by: item.addedBy || item.added_by,
            _added_date: item.addedAt || item.added_date,
            _note: item.note,
            _anilist_id: anilistId
          });
        }
      });

      const groups: GroupedAnime = {};
      processedAnimeList.forEach((anime) => {
        const user = anime._added_by || "Unknown";
        if (!groups[user]) groups[user] = [];
        groups[user].push(anime);
      });
      setGroupedAnime(groups);
    } catch (err: any) {
      console.error("Error fetching list data:", err);
      if (err.response && err.response.data) {
        const errorMsg = err.response.data.error;
        if (errorMsg === "['You do not have permission to view this private list']") {
          navigate('/browse');
        }
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [listId, navigate]);

  useEffect(() => {
    setLoading(true);
    fetchListDetails();
    fetchMembersData();
  }, [listId, fetchListDetails, fetchMembersData]);

  useEffect(() => {
    fetchRequestsData();
  }, [fetchRequestsData]);

  const handleAcceptRequest = useCallback(async (request: ListRequest) => {
    try {
      if (request.type === 'join') {
        await listService.respondToJoinRequest(listId, request.id, 'approve');
        alert(`User @${request.username} has joined the list.`);
      } else if (request.type === 'edit') {
        await listService.respondToEditRequest(listId, request.id, 'approve');
        alert(`User @${request.username} is now an Editor.`);
      }
      fetchRequestsData();
      fetchMembersData();
    } catch (error) {
      console.error("Accept failed:", error);
      alert("Failed to accept request. Please try again.");
    }
  }, [listId, fetchRequestsData, fetchMembersData]);

  const handleRejectRequest = useCallback(async (request: ListRequest) => {
    try {
      if (request.type === 'join') {
        await listService.respondToJoinRequest(listId, request.id, 'reject');
      } else if (request.type === 'edit') {
        await listService.respondToEditRequest(listId, request.id, 'reject');
      }
      fetchRequestsData();
    } catch (error) {
      console.error("Reject failed:", error);
      alert("Failed to reject request.");
    }
  }, [listId, fetchRequestsData]);

  const handleEditListClick = useCallback(() => {
    if (currentPermission !== "owner") {
      alert("You do not have permission to edit this list.");
      return;
    }
    setShowEditModal(true);
  }, [currentPermission]);

  const handleUpdateSuccess = useCallback((updatedData: Partial<ListInfo>) => {
    setListInfo(prev => ({ ...prev, ...updatedData }));
  }, []);

  const handleDeleteList = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        await listService.deleteCustomList(listId);
        navigate(-1);
      } catch (error) {
        alert("An error occurred while deleting the list.");
      }
    }
  }, [listId, navigate]);

  const handleOpenJoinRequest = useCallback(() => {
    setRequestType('join');
    setShowRequestModal(true);
  }, []);

  const handleOpenEditRequest = useCallback(() => {
    setRequestType('edit');
    setShowRequestModal(true);
  }, []);

  const handleSubmitRequest = useCallback(async (message: string) => {
    setIsSubmittingRequest(true);
    try {
      if (requestType === 'join') {
        await listService.requestJoin(listId, message);
        alert("Your join request has been sent successfully!");
      } else if (requestType === 'edit') {
        await listService.requestEdit(listId, message);
        alert("Your edit access request has been sent successfully!");
      }
      setShowRequestModal(false);
    } catch (error: any) {
      console.error("Failed to send request:", error);
      const errorMsg = error.response?.data?.message || "Failed to send request.";
      alert(errorMsg);
    } finally {
      setIsSubmittingRequest(false);
    }
  }, [listId, requestType]);

  const handleAddAnime = useCallback(async (anime: any) => {
    try {
      const payload = {
        anilistId: anime.anilist_id || anime.media?.id || anime.id,
        note: ""
      };
      await listService.addAnimeToCustomList(listId, payload);
      
      const animeId = payload.anilistId;
      if (!animeDetailsCache.current.has(animeId)) {
          animeDetailsCache.current.set(animeId, anime); 
      }

      const newAnimeItem = {
        ...anime,
        _added_by: currentUsername,
        _added_date: new Date().toISOString(),
        _note: "",
        _anilist_id: payload.anilistId
      };
    
      setGroupedAnime(prev => {
        const updated = { ...prev };
        if (!updated[currentUsername!]) {
          updated[currentUsername!] = [];
        }
        const isExist = updated[currentUsername!].some(item => 
            String(item._anilist_id || item.id) === String(newAnimeItem._anilist_id)
        );
        if (!isExist) {
          updated[currentUsername!].push(newAnimeItem);
        }
        return updated;
      });
    } catch (error) {
      console.error("Failed to add anime:", error);
      throw error;
    }
  }, [listId, currentUsername]);

  const toggleDeleteMode = useCallback(() => {
    if (deleteMode) setSelectedAnimeIds([]);
    setDeleteMode(!deleteMode);
  }, [deleteMode]);

  const handleSelectAnime = useCallback((anilistId: string | number) => {
    if (!deleteMode) return;
    setSelectedAnimeIds(prev =>
      prev.includes(anilistId) ? prev.filter(id => id !== anilistId) : [...prev, anilistId]
    );
  }, [deleteMode]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedAnimeIds.length === 0) return;
    setIsDeleting(true);
    try {
      await Promise.all(selectedAnimeIds.map(aid => listService.removeAnimeFromCustomList(listId, aid)));
      setGroupedAnime(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(user => {
          updated[user] = updated[user].filter(
            anime => !selectedAnimeIds.includes(anime._anilist_id || anime.id)
          );
        });
        return updated;
      });
    } catch (error) {
      alert("Some items could not be removed.");
    } finally {
      setIsDeleting(false);
      setDeleteMode(false);
      setSelectedAnimeIds([]);
    }
  }, [selectedAnimeIds, listId]);

  const filterAnime = useCallback((list: AnimeItemDetail[]) => {
    if (!searchTerm) return list;
    return list.filter(anime => {
      const title = anime.name_romaji || anime.title_english || "";
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const handleOpenAddEditor = useCallback(() => {
    setModalRoleType('editor');
    setShowUserModal(true);
  }, []);

  const handleOpenAddViewer = useCallback(() => {
    setModalRoleType('viewer');
    setShowUserModal(true);
  }, []);

  const handleUserAdded = useCallback(() => {
    fetchMembersData();
  }, [fetchMembersData]);

  const handleRemoveMember = useCallback(async (username: string) => {
    try {
      await listService.removeMemberFromList(listId, username);
      fetchMembersData();
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member. Please try again.");
    }
  }, [listId, fetchMembersData]);

  return {
    currentUsername,
    currentPermission,
    canEdit,
    isViewer,
    listInfo,
    groupedAnime,
    loading,
    searchTerm,
    members,
    pendingRequests,
    showEditModal,
    showAddModal,
    showUserModal,
    modalRoleType,
    showRequestModal,
    requestType,
    isSubmittingRequest,
    deleteMode,
    selectedAnimeIds,
    isDeleting,
    allAnimeInList,
    currentUserHasItems,
    setSearchTerm,
    setShowAddModal,
    setShowEditModal,
    setShowUserModal,
    setShowRequestModal,
    filterAnime,
    handleAcceptRequest,
    handleRejectRequest,
    handleEditListClick,
    handleUpdateSuccess,
    handleDeleteList,
    handleOpenJoinRequest,
    handleOpenEditRequest,
    handleSubmitRequest,
    handleAddAnime,
    toggleDeleteMode,
    handleSelectAnime,
    handleConfirmDelete,
    handleOpenAddEditor,
    handleOpenAddViewer,
    handleUserAdded,
    handleRemoveMember,
  };
};