var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useCallback, useMemo } from 'react';
import { listService } from '../../services/list.service';
import { animeService } from '../../services/anime.service';
export const useAnimeListPage = (listId, locationState, onNavigate) => {
    // Fallback navigate implementation
    const navigate = useCallback(((to, options) => {
        if (onNavigate) {
            if (typeof to === 'number') {
                onNavigate(to);
            }
            else {
                onNavigate(to, options);
            }
            return;
        }
        if (typeof window === 'undefined')
            return;
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
    }), [onNavigate]);
    const currentUsername = typeof localStorage !== 'undefined'
        ? localStorage.getItem("username")
        : null;
    const [currentPermission, setCurrentPermission] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem("permission_level") : null);
    const canEdit = currentPermission === "owner" || currentPermission === "edit";
    const isViewer = currentPermission === "view" || currentPermission === "viewer";
    // --- LIST INFO STATE ---
    const [listInfo, setListInfo] = useState((locationState === null || locationState === void 0 ? void 0 : locationState.listData) || {
        list_name: "Loading...",
        description: "",
        is_private: false,
        color: "#3db4f2",
        is_owner: false
    });
    // --- CONTENT STATE ---
    const [groupedAnime, setGroupedAnime] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // --- MEMBER & REQUEST STATE ---
    const [members, setMembers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    // --- MODAL STATES ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [modalRoleType, setModalRoleType] = useState('viewer');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestType, setRequestType] = useState('join');
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    // --- DELETE LOGIC STATES ---
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedAnimeIds, setSelectedAnimeIds] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    // All anime in list (flat array)
    const allAnimeInList = useMemo(() => {
        return Object.values(groupedAnime).flat();
    }, [groupedAnime]);
    // Current user has items
    const currentUserHasItems = useMemo(() => {
        return currentUsername ?
            (groupedAnime[currentUsername] && groupedAnime[currentUsername].length > 0) :
            false;
    }, [groupedAnime, currentUsername]);
    // =================================================================
    // DATA FETCHING
    // =================================================================
    const fetchMembersData = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!listId)
            return;
        try {
            const res = yield listService.getMembers(listId);
            const memberList = res.data.members || [];
            setMembers(memberList);
            if (currentUsername) {
                const currentUserData = memberList.find((m) => m.username === currentUsername);
                if (currentUserData) {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem("permission_level", currentUserData.permission_level || '');
                    }
                    setCurrentPermission(currentUserData.permission_level || null);
                    setListInfo(prev => (Object.assign(Object.assign({}, prev), { is_owner: currentUserData.is_owner || false })));
                }
                else {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.removeItem("permission_level");
                    }
                    setCurrentPermission(null);
                    setListInfo(prev => (Object.assign(Object.assign({}, prev), { is_owner: false })));
                }
            }
        }
        catch (error) {
            console.error("Failed to fetch list members:", error);
        }
    }), [listId, currentUsername]);
    const fetchRequestsData = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (listInfo.is_owner && listId) {
            try {
                const res = yield listService.getListRequests(listId);
                setPendingRequests(res.data.requests || []);
            }
            catch (err) {
                console.error("Failed to fetch requests", err);
            }
        }
    }), [listInfo.is_owner, listId]);
    const fetchListDetails = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!listId)
            return;
        setDeleteMode(false);
        setSelectedAnimeIds([]);
        try {
            const res = yield listService.getCustomListItems(listId);
            const data = res.data;
            setListInfo(prev => (Object.assign(Object.assign({}, prev), { list_name: data.list_name || prev.list_name, description: data.description !== undefined ? data.description : prev.description, is_private: data.is_private !== undefined ? data.is_private : prev.is_private, color: data.color || prev.color })));
            const items = data.anime_items || [];
            const detailedPromises = items.map((item) => animeService.getById(item.anilist_id)
                .then((animeRes) => (Object.assign(Object.assign({}, animeRes.data), { _added_by: item.added_by, _added_date: item.added_date, _note: item.note, _anilist_id: item.anilist_id })))
                .catch(() => null));
            const detailedAnimeList = yield Promise.all(detailedPromises);
            const groups = {};
            detailedAnimeList.forEach((anime) => {
                if (anime) {
                    const user = anime._added_by || "Unknown";
                    if (!groups[user])
                        groups[user] = [];
                    groups[user].push(anime);
                }
            });
            setGroupedAnime(groups);
        }
        catch (err) {
            console.error("Error fetching list data:", err);
            if (err.response && err.response.data) {
                const errorMsg = err.response.data.error;
                if (errorMsg === "['You do not have permission to view this private list']") {
                    navigate('/browse');
                }
            }
        }
        finally {
            setLoading(false);
        }
    }), [listId]);
    useEffect(() => {
        setLoading(true);
        fetchListDetails();
        fetchMembersData();
    }, [listId]);
    useEffect(() => {
        fetchRequestsData();
    }, [fetchRequestsData]);
    // =================================================================
    // HANDLERS
    // =================================================================
    const handleAcceptRequest = useCallback((request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (request.request_type === 'join') {
                yield listService.respondToJoinRequest(listId, request.request_id, 'approve');
                alert(`User @${request.username} has joined the list.`);
            }
            else if (request.request_type === 'edit_permission' || request.request_type === 'edit') {
                yield listService.respondToEditRequest(listId, request.request_id, 'approve');
                alert(`User @${request.username} is now an Editor.`);
            }
            fetchRequestsData();
            fetchMembersData();
        }
        catch (error) {
            console.error("Accept failed:", error);
            alert("Failed to accept request. Please try again.");
        }
    }), [listId, fetchRequestsData, fetchMembersData]);
    const handleRejectRequest = useCallback((request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (request.request_type === 'join') {
                yield listService.respondToJoinRequest(listId, request.request_id, 'reject');
            }
            else if (request.request_type === 'edit_permission' || request.request_type === 'edit') {
                yield listService.respondToEditRequest(listId, request.request_id, 'reject');
            }
            fetchRequestsData();
        }
        catch (error) {
            console.error("Reject failed:", error);
            alert("Failed to reject request.");
        }
    }), [listId, fetchRequestsData]);
    const handleEditListClick = useCallback(() => {
        if (currentPermission !== "owner") {
            alert("You do not have permission to edit this list.");
            return;
        }
        setShowEditModal(true);
    }, [currentPermission]);
    const handleUpdateSuccess = useCallback((updatedData) => {
        setListInfo(prev => (Object.assign(Object.assign({}, prev), updatedData)));
    }, []);
    const handleDeleteList = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (window.confirm("Are you sure you want to delete this list?")) {
            try {
                yield listService.deleteCustomList(listId);
                navigate(-1);
            }
            catch (error) {
                alert("An error occurred while deleting the list.");
            }
        }
    }), [listId, navigate]);
    const handleOpenJoinRequest = useCallback(() => {
        setRequestType('join');
        setShowRequestModal(true);
    }, []);
    const handleOpenEditRequest = useCallback(() => {
        setRequestType('edit');
        setShowRequestModal(true);
    }, []);
    const handleSubmitRequest = useCallback((message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        setIsSubmittingRequest(true);
        try {
            if (requestType === 'join') {
                yield listService.requestJoin(listId, message);
                alert("Your join request has been sent successfully!");
            }
            else if (requestType === 'edit') {
                yield listService.requestEdit(listId, message);
                alert("Your edit access request has been sent successfully!");
            }
            setShowRequestModal(false);
        }
        catch (error) {
            console.error("Failed to send request:", error);
            const errorMsg = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to send request.";
            alert(errorMsg);
        }
        finally {
            setIsSubmittingRequest(false);
        }
    }), [listId, requestType]);
    const handleAddAnime = useCallback((anime) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const payload = {
                anilist_id: anime.anilist_id || ((_a = anime.media) === null || _a === void 0 ? void 0 : _a.id) || anime.id,
                note: ""
            };
            yield listService.addAnimeToCustomList(listId, payload);
            const newAnimeItem = Object.assign(Object.assign({}, anime), { _added_by: currentUsername, _added_date: new Date().toISOString(), _note: "", _anilist_id: payload.anilist_id });
            setGroupedAnime(prev => {
                const updated = Object.assign({}, prev);
                if (!updated[currentUsername]) {
                    updated[currentUsername] = [];
                }
                updated[currentUsername].push(newAnimeItem);
                return updated;
            });
            //fetchListDetails();
        }
        catch (error) {
            console.error("Failed to add anime:", error);
            throw error;
        }
    }), [listId, currentUsername]);
    const toggleDeleteMode = useCallback(() => {
        if (deleteMode)
            setSelectedAnimeIds([]);
        setDeleteMode(!deleteMode);
    }, [deleteMode]);
    const handleSelectAnime = useCallback((anilistId) => {
        if (!deleteMode)
            return;
        setSelectedAnimeIds(prev => prev.includes(anilistId) ? prev.filter(id => id !== anilistId) : [...prev, anilistId]);
    }, [deleteMode]);
    const handleConfirmDelete = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (selectedAnimeIds.length === 0)
            return;
        setIsDeleting(true);
        try {
            yield Promise.all(selectedAnimeIds.map(aid => listService.removeAnimeFromCustomList(listId, aid)));
            //fetchListDetails();
            setGroupedAnime(prev => {
                const updated = Object.assign({}, prev);
                Object.keys(updated).forEach(user => {
                    updated[user] = updated[user].filter(anime => !selectedAnimeIds.includes(anime._anilist_id || anime.id));
                });
                return updated;
            });
        }
        catch (error) {
            alert("Some items could not be removed.");
        }
        finally {
            setIsDeleting(false);
            setDeleteMode(false);
            setSelectedAnimeIds([]);
        }
    }), [selectedAnimeIds, listId, currentUsername]);
    const filterAnime = useCallback((list) => {
        if (!searchTerm)
            return list;
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
    const handleRemoveMember = useCallback((username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield listService.removeMemberFromList(listId, username);
            fetchMembersData();
        }
        catch (error) {
            console.error("Failed to remove member:", error);
            alert("Failed to remove member. Please try again.");
        }
    }), [listId, fetchMembersData]);
    return {
        // State
        currentUsername,
        currentPermission, // [FIX] Export currentPermission
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
        // Setters
        setSearchTerm,
        setShowAddModal,
        setShowEditModal,
        setShowUserModal,
        setShowRequestModal,
        // Methods
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
//# sourceMappingURL=useAnimeListPage.js.map