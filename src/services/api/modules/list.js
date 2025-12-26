import { axiosInstance } from '../core';

export const getUserCustomLists = (username = null) => {
  const url = username ? `/list/user/?username=${username}` : '/list/user/';
  return axiosInstance.get(url);
};

export const createCustomList = (listData) => {
  return axiosInstance.post('/list/create/', listData);
};

export const updateCustomList = (listId, listData) => {
  return axiosInstance.put(`/list/${listId}/update/`, listData);
};

export const deleteCustomList = (listId) => {
  return axiosInstance.delete(`/list/${listId}/delete/`);
};

export const getCustomListItems = (listId) => {
  return axiosInstance.get(`/list/anime/${listId}/`);
};

export const addAnimeToCustomList = (listId, animeData) => {
  return axiosInstance.post(`/list/anime/${listId}/add/`, animeData);
};

export const updateAnimeInCustomList = (listId, anilistId, data) => {
  return axiosInstance.put(`/list/anime/${listId}/${anilistId}/update/`, data);
};

export const removeAnimeFromCustomList = (listId, anilistId) => {
  return axiosInstance.delete(`/list/anime/${listId}/${anilistId}/remove/`);
};

export const getListMembers = (listId) => {
  return axiosInstance.get(`/list/member/${listId}/list/`);
};

export const addMemberToList = (listId, userData) => {
  return axiosInstance.post(`/list/member/${listId}/add/`, userData);
};

export const removeMemberFromList = (listId, username) => {
  return axiosInstance.delete(`/list/member/${listId}/remove/`, { params: { username } });
};

export const updateMemberPermission = (listId, permissionData) => {
  return axiosInstance.put(`/list/member/${listId}/permission/`, permissionData);
};

export const getMemberStatusInList = (listId) => {
  return axiosInstance.get(`/list/member/${listId}/status/`);
};

export const getListRequests = (listId) => {
  return axiosInstance.get(`/list/${listId}/requests/`);
};

export const requestJoinList = (listId, message) => {
  return axiosInstance.post(`/list/${listId}/request-join/`, {
    request_type: "join",
    message: message
  });
};

export const respondToJoinRequest = (listId, requestId, action) => {
  return axiosInstance.post(`/list/${listId}/join-requests/${requestId}/respond/`, {
    action: action, 
    can_edit: false
  });
};

export const requestEditList = (listId, message) => {
    return axiosInstance.post(`/list/${listId}/request-edit/`, {
    request_type: "edit_permission",
    message: message
  });
};

export const respondToEditRequest = (listId, requestId, action) => {
   return axiosInstance.post(`/list/${listId}/edit-requests/${requestId}/respond/`, {
    action: action, 
    can_edit: true
  });
};

export const toggleLikeList = (listId) => {
  return axiosInstance.post(`/list/${listId}/like/`);
};

export const getListLikeStatus = (listId) => {
  return axiosInstance.get(`/list/${listId}/like/status/`);
};

export const getListLikers = (listId, data = {}) => {
  return axiosInstance.post(`/list/${listId}/likers/`, data);
};

export const getListsLikedByUser = (data = {}) => {
  return axiosInstance.post('/list/likes/user/', data);
};

export const getTrendingLists = (data = {}) => {
  return axiosInstance.post('/list/likes/trending/', data);
};

export const getMostLikedLists = () => {
  return axiosInstance.post('/list/likes/most-liked/', { limit: 20 });
};

export const searchCustomLists = (keyword) => {
  return axiosInstance.post('/list/search/', {
    query: keyword,
    limit: 20
  });
};