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
    // --- Likes & Trending ---
    toggleLike: (listId) => apiClient.post(`/list/${listId}/like/`),
    getTrending: () => apiClient.post('/list/likes/trending/'),
    search: (keyword) => apiClient.post('/list/search/', { query: keyword, limit: 20 }),
};
//# sourceMappingURL=list.service.js.map