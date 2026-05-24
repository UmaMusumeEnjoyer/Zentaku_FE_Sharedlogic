// shared-logic/src/services/auth.service.ts
import { apiClient } from '../api/apiClient';
import {
  LoginCredentials,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailResponse,
  RefreshTokenResponse,
  CurrentUserResponse,
} from '../features/authPage/auth.types';

export const authService = {
  /**
   * Đăng nhập
   * POST /auth/login
   * Body: { email, password, rememberMe? }
   * Response (unwrapped): { accessToken, expiresIn?, user }
   * Refresh token được BE set qua HTTP-only cookie tự động
   */
  login: (credentials: LoginCredentials) => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Đăng ký tài khoản mới
   * POST /auth/register
   * Body: { username, email, password, confirmPassword, displayName? }
   * Response (unwrapped): { message }
   * Lưu ý: Zentaku_BE không trả token khi register, user cần verify email rồi login
   */
  register: (userData: RegisterRequest) => {
    return apiClient.post<RegisterResponse>('/auth/register', userData);
  },

  /**
   * Xác thực email qua GET (link từ email)
   * GET /auth/verify-email?token=...
   */
  verifyEmail: (token: string) => {
    return apiClient.get<VerifyEmailResponse>(`/auth/verify-email?token=${token}`);
  },

  /**
   * Xác thực email qua POST (bảo mật hơn)
   * POST /auth/verify-email
   * Body: { token }
   */
  verifyEmailPost: (token: string) => {
    return apiClient.post<VerifyEmailResponse>('/auth/verify-email', { token });
  },

  /**
   * Làm mới access token
   * POST /auth/refresh-token
   * - HTTP-only cookie tự động gửi refresh token (withCredentials: true)
   * - Fallback: truyền refreshToken trong body cho môi trường không hỗ trợ cookie (React Native)
   * Response (unwrapped): { accessToken, expiresIn? }
   */
  refreshToken: (refreshToken?: string) => {
    return apiClient.post<RefreshTokenResponse>(
      '/auth/refresh-token',
      refreshToken ? { refreshToken } : {}
    );
  },

  /**
   * Đăng xuất - Xóa cookie và phiên đăng nhập phía BE
   * POST /auth/logout
   */
  logout: () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Lấy thông tin user hiện tại qua accessToken
   * GET /auth/me
   * Response (unwrapped): CurrentUserResponse
   */
  getCurrentUser: () => {
    return apiClient.get<CurrentUserResponse>('/auth/me');
  },
};