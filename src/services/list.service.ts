import { apiClient } from '../api/apiClient';

export const listService = {
  // --- CRUD ---
  getUserLists: (username?: string) => {
    const url = username ? `/list/user/?username=${username}` : '/list/user/';
    return apiClient.get(url);
  },
  create: (data: any) => apiClient.post('/list/create/', data),
  delete: (id: string) => apiClient.delete(`/list/${id}/delete/`),
  
  // --- Items in List ---
  getItems: (listId: string) => apiClient.get(`/list/anime/${listId}/`),
  addItem: (listId: string, animeData: any) => apiClient.post(`/list/anime/${listId}/add/`, animeData),

  // --- Members & Request ---
  getMembers: (listId: string) => apiClient.get(`/list/member/${listId}/list/`),
  requestJoin: (listId: string, message: string) => {
    return apiClient.post(`/list/${listId}/request-join/`, { request_type: "join", message });
  },

  // --- Likes & Trending ---
  toggleLike: (listId: string) => apiClient.post(`/list/${listId}/like/`),
  getTrending: () => apiClient.post('/list/likes/trending/'),
  search: (keyword: string) => apiClient.post('/list/search/', { query: keyword, limit: 20 }),

  getListsLikedByUser : (data = {}) => {
  // data có thể chứa { username: "abc", page: 1, ... }
  return apiClient.post('/list/likes/user/', data);
  },

  getMostLikedLists : () => {
  return apiClient.post('/list/likes/most-liked/', { 
    limit: 20 
  });
  },

  searchCustomLists : (keyword : string) => {
  return apiClient.post('/list/search/', {
    query: keyword,
    limit: 20 // Limit được fix cứng là 20 theo yêu cầu
  });
  },
};