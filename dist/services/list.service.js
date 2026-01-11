import { apiClient } from '../api/apiClient';
export const listService = {
    // --- CRUD ---
    getUserLists: (username) => {
        const url = username ? `/list/user/?username=${username}` : '/list/user/';
        return apiClient.get(url);
    },
    create: (data) => apiClient.post('/list/create/', data),
    delete: (id) => apiClient.delete(`/list/${id}/delete/`),
    // --- Items in List ---
    getItems: (listId) => apiClient.get(`/list/anime/${listId}/`),
    addItem: (listId, animeData) => apiClient.post(`/list/anime/${listId}/add/`, animeData),
    // --- Members & Request ---
    getMembers: (listId) => apiClient.get(`/list/member/${listId}/list/`),
    requestJoin: (listId, message) => {
        return apiClient.post(`/list/${listId}/request-join/`, { request_type: "join", message });
    },
    getListRequests: (listId) => {
        return apiClient.get(`/list/${listId}/requests/`);
    },
    getCustomListItems: (listId) => {
        return apiClient.get(`/list/anime/${listId}/`);
    },
    respondToJoinRequest: (listId, requestId, action) => {
        return apiClient.post(`/list/${listId}/join-requests/${requestId}/respond/`, {
            action: action,
            can_edit: false // Fix cứng theo yêu cầu
        });
    },
    respondToEditRequest: (listId, requestId, action) => {
        return apiClient.post(`/list/${listId}/edit-requests/${requestId}/respond/`, {
            action: action,
            can_edit: true // Fix cứng theo yêu cầu
        });
    },
    deleteCustomList: (listId) => {
        return apiClient.delete(`/list/${listId}/delete/`);
    },
    requestEdit: (listId, message) => {
        return apiClient.post(`/list/${listId}/request-edit/`, {
            request_type: "edit_permission", // Fix cứng theo yêu cầu
            message: message // Nội dung message truyền từ giao diện
        });
    },
    addAnimeToCustomList: (listId, animeData) => {
        return apiClient.post(`/list/anime/${listId}/add/`, animeData);
    },
    removeAnimeFromCustomList: (listId, anilistId) => {
        return apiClient.delete(`/list/anime/${listId}/${anilistId}/remove/`);
    },
    removeMemberFromList: (listId, username) => {
        return apiClient.delete(`/list/member/${listId}/remove/`, { params: { username } });
    },
    // --- Likes & Trending ---
    toggleLike: (listId) => apiClient.post(`/list/${listId}/like/`),
    getTrending: () => apiClient.post('/list/likes/trending/'),
    search: (keyword) => apiClient.post('/list/search/', { query: keyword, limit: 20 }),
    getListsLikedByUser: (data = {}) => {
        // data có thể chứa { username: "abc", page: 1, ... }
        return apiClient.post('/list/likes/user/', data);
    },
    getMostLikedLists: () => {
        return apiClient.post('/list/likes/most-liked/', {
            limit: 20
        });
    },
    searchCustomLists: (keyword) => {
        return apiClient.post('/list/search/', {
            query: keyword,
            limit: 20 // Limit được fix cứng là 20 theo yêu cầu
        });
    },
    updateCustomList: (listId, listData) => {
        return apiClient.put(`/list/${listId}/update/`, listData);
    },
    getListLikeStatus: (listId) => {
        return apiClient.get(`/list/${listId}/like/status/`);
    },
    getListLikers: (listId, data) => {
        return apiClient.post(`/list/${listId}/likers/`, data);
    },
    addMemberToList: (listId, userData) => {
        return apiClient.post(`/list/member/${listId}/add/`, userData);
    },
    updateMemberPermission: (listId, permissionData) => {
        return apiClient.put(`/list/member/${listId}/permission/`, permissionData);
    },
};
//# sourceMappingURL=list.service.js.map