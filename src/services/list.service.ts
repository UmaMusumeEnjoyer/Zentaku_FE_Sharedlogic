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

  getListRequests : (listId : string) => {
  return apiClient.get(`/list/${listId}/requests/`);
  },

  getCustomListItems : (listId : string) => {
  return apiClient.get(`/list/anime/${listId}/`);
  },

  respondToJoinRequest : (listId : string | number, requestId : string | number, action : {}) => {
  return apiClient.post(`/list/${listId}/join-requests/${requestId}/respond/`, {
    action: action, 
    can_edit: false // Fix cứng theo yêu cầu
  });
  },

  respondToEditRequest : (listId : string | number, requestId : string | number, action : {}) => {
   return apiClient.post(`/list/${listId}/edit-requests/${requestId}/respond/`, {
    action: action, 
    can_edit: true // Fix cứng theo yêu cầu
  });
  },

  deleteCustomList : (listId : string) => {
  return apiClient.delete(`/list/${listId}/delete/`);
  },

  requestEdit : (listId : string, message : string) => {
    return apiClient.post(`/list/${listId}/request-edit/`, {
    request_type: "edit_permission", // Fix cứng theo yêu cầu
    message: message      // Nội dung message truyền từ giao diện
  });
  },

  addAnimeToCustomList : (listId : string, animeData : {}) => {
  return apiClient.post(`/list/anime/${listId}/add/`, animeData);
  },

  removeAnimeFromCustomList : (listId : string, anilistId : string | number) => {
  return apiClient.delete(`/list/anime/${listId}/${anilistId}/remove/`);
  },

  removeMemberFromList : (listId:string, username:string) => {
  return apiClient.delete(`/list/member/${listId}/remove/`, { params: { username } });
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

  updateCustomList : (listId: string, listData : {}) => {
  return apiClient.put(`/list/${listId}/update/`, listData);
  },

  getListLikeStatus : (listId : string) => {
  return apiClient.get(`/list/${listId}/like/status/`);
  },

  getListLikers : (listId : string, data : {}) => {
  return apiClient.post(`/list/${listId}/likers/`, data);
  },

  addMemberToList : (listId : string, userData : {}) => {
  return apiClient.post(`/list/member/${listId}/add/`, userData);
  },

  updateMemberPermission : (listId : string, permissionData : {}) => {
  return apiClient.put(`/list/member/${listId}/permission/`, permissionData);
  },
};