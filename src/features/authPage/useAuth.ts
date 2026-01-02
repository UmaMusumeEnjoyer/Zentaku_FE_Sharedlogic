// shared-logic/src/shared/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
import { User, LoginCredentials } from './auth.types';

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  fetchUserInfo: (username: string) => Promise<void>;
  updateUserInState: (userData: Partial<User>) => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async (username: string) => {
    try {
      setIsLoading(true);
      const response = await userService.getUserProfile(username);
      if (response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      setError('Failed to fetch user information');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      const accessToken = response.data.tokens.access;
      const refreshToken = response.data.tokens.refresh;
      const username = response.data.user?.username;

      if (accessToken) {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        if (username) {
          localStorage.setItem('username', username);
          await fetchUserInfo(username);
        }
        
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: 'Token not found in response' };
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserInfo]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setUser(null);
    setError(null);
  }, []);

  const updateUserInState = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    fetchUserInfo,
    updateUserInState,
  };
};