// shared-logic/src/shared/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { authService } from '../../services/auth.service';
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

  /**
   * Lấy thông tin user - ưu tiên GET /auth/me (Zentaku_BE),
   * fallback sang getUserProfile nếu cần
   */
  const fetchUserInfo = useCallback(async (_username?: string) => {
    try {
      setIsLoading(true);
      // Zentaku_BE: Dùng /auth/me để lấy thông tin user hiện tại qua accessToken
      const response = await authService.getCurrentUser();
      if (response.data) {
        const userData = response.data;
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          displayName: userData.displayName,
          avatar: userData.avatar,
          bio: userData.bio,
          gender: userData.gender,
          birthday: userData.birthday,
          location: userData.location,
          website: userData.website,
          banner: userData.banner,
          createdAt: userData.createdAt,
          // Backward compatibility: map sang trường cũ cho các UI chưa cập nhật
          avatar_url: userData.avatar,
          first_name: userData.displayName,
        });
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      setError('Failed to fetch user information');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Đăng nhập - Zentaku_BE response:
   * { accessToken, expiresIn?, user: { username, email, displayName? } }
   * Refresh token được set qua HTTP-only cookie tự động
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      const responseData = response.data;

      // Zentaku_BE trả về accessToken trực tiếp (không qua tokens object)
      const accessToken = responseData.accessToken;
      const username = responseData.user?.username;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        // Zentaku_BE: refreshToken có thể lưu qua HTTP-only cookie, 
        // nhưng ta hứng thêm fallback từ responseData để xử lý lỗi timeout
        if (responseData.refreshToken) {
          localStorage.setItem('refreshToken', responseData.refreshToken);
        }

        if (username) {
          localStorage.setItem('username', username);
          // Gọi /auth/me để lấy full user info
          fetchUserInfo(username).catch(err => console.error(err));
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

  /**
   * Đăng xuất - Gọi API logout của Zentaku_BE để xóa cookie phía server,
   * sau đó xóa token và state phía client
   */
  const logout = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      try {
        // Đợi API hoàn thành để request kịp lấy token từ localStorage
        await authService.logout();
      } catch (err) {
        console.error('Logout API error:', err);
      }
    }

    // Xóa state phía client
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setUser(null);
    setError(null);
  }, []);

  const updateUserInState = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) {
        return userData as User;
      }
      // ✅ Create completely new object to ensure React detects change
      const updated = {
        ...prev,
        ...userData,
        // Ensure important fields are properly updated (camelCase Zentaku_BE fields)
        avatar: userData.avatar !== undefined ? userData.avatar : prev.avatar,
        username: userData.username !== undefined ? userData.username : prev.username,
        displayName: userData.displayName !== undefined ? userData.displayName : prev.displayName,
        // Backward compatibility: đồng bộ trường cũ
        avatar_url: userData.avatar !== undefined ? userData.avatar : (userData.avatar_url !== undefined ? userData.avatar_url : prev.avatar_url),
        first_name: userData.displayName !== undefined ? userData.displayName : (userData.first_name !== undefined ? userData.first_name : prev.first_name),
      };
      return updated;
    });
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