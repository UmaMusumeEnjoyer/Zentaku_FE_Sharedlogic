import { apiClient } from '../api/apiClient';

// ====================================================================
// MAPPING FUNCTIONS (Backward Compatibility)
// Tự động map dữ liệu từ Frontend cũ (snake_case) sang Zentaku_BE
// ====================================================================

const mapListPayload = (data: any) => {
  if (!data) return data;
  let privacy = data.privacy;
  if (data.is_private === true) privacy = 'PRIVATE';
  else if (data.is_private === false) privacy = 'PUBLIC';

  return {
    name: data.list_name || data.name,
    description: data.description,
    privacy: privacy,
    bannerImage: data.bannerImage || data.color,
  };
};

// ====================================================================
// LIST SERVICE - Cập nhật cho Zentaku_BE
// ====================================================================

export const listService = {
  // --- CRUD ---
  getUserLists: (username?: string) => {
    // Sửa URL không có slash ở cuối
    const url = username ? `/list/user?username=${username}` : '/list/user';
    return apiClient.get(url);
  },

  create: (data: any) => {
    const payload = mapListPayload(data);
    return apiClient.post('/list/create', payload);
  },

  delete: (id: string) => {
    return apiClient.delete(`/list/${id}/delete`);
  },

  deleteCustomList: (listId: string) => {
    return apiClient.delete(`/list/${listId}/delete`);
  },

  updateCustomList: (listId: string, listData: any) => {
    const payload = mapListPayload(listData);
    return apiClient.put(`/list/${listId}/update`, payload);
  },

  // --- Upload Banner ---
  uploadBanner: (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/list/upload-banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // --- List Detail (NEW) ---
  /**
   * API mới lấy chi tiết danh sách và các animeItems bên trong
   * Zentaku_BE: GET /list/{listId}
   */
  getListDetail: (listId: string) => {
    return apiClient.get(`/list/${listId}`);
  },

  // --- Items in List ---
  getItems: (listId: string) => {
    // API cũ là /list/anime/{listId}/. Tạm giữ endpoint cũ nhưng bỏ slash, 
    // hoặc có thể gọi getListDetail. 
    // Theo task, GET /api/list/anime/{listId} vẫn được nhắc đến.
    return apiClient.get(`/list/anime/${listId}`);
  },
  
  getCustomListItems: (listId: string) => {
    return apiClient.get(`/list/anime/${listId}`);
  },

  addItem: (listId: string, animeData: any) => {
    return apiClient.post(`/list/anime/${listId}/add`, animeData);
  },

  addAnimeToCustomList: (listId: string, animeData: any) => {
    return apiClient.post(`/list/anime/${listId}/add`, animeData);
  },

  removeAnimeFromCustomList: (listId: string, anilistId: string | number) => {
    return apiClient.delete(`/list/anime/${listId}/${anilistId}/remove`);
  },

  // --- Members & Request ---
  getMembers: (listId: string) => {
    return apiClient.get(`/list/member/${listId}/list`);
  },

  addMemberToList: (listId: string, userData: any) => {
    return apiClient.post(`/list/member/${listId}/add`, userData);
  },

  removeMemberFromList: (listId: string, username: string) => {
    return apiClient.delete(`/list/member/${listId}/remove`, { params: { username } });
  },

  updateMemberPermission: (listId: string, permissionData: any) => {
    // Chuyển can_edit thành permission_level
    const payload = {
      username: permissionData.username,
      permission: permissionData.can_edit ? 'EDITOR' : 'VIEWER'
    };
    return apiClient.put(`/list/member/${listId}/permission`, payload);
  },

  requestJoin: (listId: string, message: string) => {
    return apiClient.post(`/list/${listId}/request-join`, { message });
  },

  requestEdit: (listId: string, message: string) => {
    return apiClient.post(`/list/${listId}/request-edit`, { message });
  },

  getListRequests: (listId: string) => {
    return apiClient.get(`/list/${listId}/requests`);
  },

  respondToJoinRequest: (listId: string | number, requestId: string | number, action: any) => {
    const actionStr = typeof action === 'string' ? action.toUpperCase() : (action?.action || '').toUpperCase();
    return apiClient.post(`/list/${listId}/join-requests/${requestId}/respond`, {
      action: actionStr
    });
  },

  respondToEditRequest: (listId: string | number, requestId: string | number, action: any) => {
    const actionStr = typeof action === 'string' ? action.toUpperCase() : (action?.action || '').toUpperCase();
    return apiClient.post(`/list/${listId}/edit-requests/${requestId}/respond`, {
      action: actionStr
    });
  },

  // --- Search / Public Lists ---
  search: (keyword: string) => {
    return apiClient.post('/list/search', { query: keyword, limit: 20 });
  },

  searchCustomLists: (keyword: string) => {
    return apiClient.post('/list/search', { query: keyword, limit: 20 });
  },

  // --- Likes ---
  toggleLike: (listId: string) => {
    return apiClient.post(`/list/${listId}/like`);
  },

  getListLikeStatus: (listId: string) => {
    return apiClient.get(`/list/${listId}/like/status`);
  },

  getListsLikedByUser: (data = {}) => {
    return apiClient.post('/list/likes/user', data);
  },

  getMostLikedLists: () => {
    return apiClient.post('/list/likes/most-liked', { limit: 20 });
  },

  // ====================================================================
  // API ĐÃ XÓA BỎ / DEPRECATED
  // Zentaku_BE không còn cung cấp các API lấy danh sách người thích hoặc trending likes
  // ====================================================================

  getTrending: () => {
    console.warn("⚠️ getTrending likes API is removed in Zentaku_BE. Returning mock.");
    return Promise.resolve({ data: [] });
  },

  getListLikers: (_listId: string, _data: any): Promise<any> => {
    console.warn("⚠️ getListLikers API is removed in Zentaku_BE. Returning mock.");
    return Promise.resolve({ data: {} as any });
  },
};