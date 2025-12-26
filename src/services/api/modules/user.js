import { axiosInstance } from '../core';


export const updateUserAnimeStatus = (animeId, data) => {
  return axiosInstance.post(`/follow/${animeId}/create/`, data);
};

export const updateUserAnimeFollow = (animeId, data) => {
  return axiosInstance.put(`/follow/${animeId}/update/`, data);
};

export const deleteUserAnimeFollow = (animeId) => {
  return axiosInstance.delete(`/follow/${animeId}/delete/`);
};

export const getUserAnimeStatus = (animeId) => {
  return axiosInstance.get(`/follow/${animeId}/get`); 
};

export const getUserProfile = (username) => {
  return axiosInstance.get(`/user/${username}/profile/`);
};

export const updateUserProfile = (userData) => {
  return axiosInstance.put('/user/profile/update/', userData);
};

export const getUserAnimeList = (username) => {
  return axiosInstance.get(`/user/${username}/animelist`);
};

export const deleteUserAvatar = () => {
  return axiosInstance.delete('/user/avatar/delete/');
};

export const uploadUserAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return axiosInstance.post('/user/avatar/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const SHORT_TTL = 1000 * 60 * 5; // 5 phút

export const getUserHeatmap = (username) => {
  const key = `user:${username}:heatmap`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/user/${username}/overview/heatmap`).then(res => {
    setCached(key, res.data, SHORT_TTL);
    return res;
  });
};

export const getUserActivity = (username) => {
  const key = `user:${username}:activity`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/user/${username}/overview/activity`).then(res => {
    setCached(key, res.data, SHORT_TTL);
    return res;
  });
};

export const searchUsers = (keyword) => {
  return axiosInstance.get(`/user/search/`, { params: { q: keyword } });
};