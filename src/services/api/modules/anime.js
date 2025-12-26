import { axiosInstance } from '../core';
import { getCached, setCached } from '../../utils/apiCache';

export const getAnimeById = (id) => {
  const key = `anime:${id}:detail`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/anilist/anime/${id}/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeCharacters = (id) => {
  const key = `anime:${id}:characters`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/anilist/anime/${id}/characters/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeStaff = (id) => {
  const key = `anime:${id}:staff`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/anilist/anime/${id}/staffs/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeStats = (id) => {
  const key = `anime:${id}:stats`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });
  
  return axiosInstance.get(`/anilist/anime/${id}/stats/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeCharacter = (id) => {
  const key = `character:${id}:detail`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/anilist/character/${id}/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getStaffById = (id) => {
  const key = `staff:${id}:detail`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/anilist/staff/${id}/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeOverview = (id) => {
  const key = `anime:${id}:overview`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/anilist/anime/${id}/overview/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeWatchInfo = (id) => {
  const key = `anime:${id}:watch`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get(`/anilist/anime/${id}/watch/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const searchAnimeByName = (keyword) => {
  return axiosInstance.post('/anilist/search/name/', { 
    name: keyword,
    manual: true 
  });
};

export const getTrendingAnime = () => {
  const key = `search:trending`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return axiosInstance.get('/anilist/search/trending/').then(res => {
    setCached(key, res.data); 
    return res;
  });
};

export const searchAnimeByCriteria = (criteria) => {
  return axiosInstance.post('/anilist/search/criteria/', criteria);
};