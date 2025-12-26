import { axiosInstance } from '../core';

export const register = (userData) => {
  return axiosInstance.post('/auth/register/', userData);
};

export const login = (credentials) => {
  return axiosInstance.post('/auth/login/', credentials);
};

export const verifyEmail = (token) => {
    return axiosInstance.get('/auth/verify-email/', {
        params: { token: token } 
    });
};