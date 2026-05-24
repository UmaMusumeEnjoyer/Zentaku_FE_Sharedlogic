// shared-logic/src/features/authPage/auth.types.ts

// === REQUEST TYPES ===

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean; // Zentaku_BE: tùy chọn, duy trì phiên đăng nhập lâu hơn
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string; // Zentaku_BE: tên hiển thị tùy chọn
}

export interface RegisterRequest extends RegisterData {
  confirmPassword: string; // Zentaku_BE: camelCase thay vì confirm_password
}

// === RESPONSE TYPES ===

/**
 * Zentaku_BE Login Response (đã unwrap envelope { success, data })
 * - accessToken trả về qua body
 * - refreshToken lưu dưới dạng HTTP-only cookie (không trả về trong body)
 */
export interface LoginResponse {
  accessToken: string;
  expiresIn?: number;
  user: {
    username: string;
    email: string;
    displayName?: string;
  };
}

/**
 * Zentaku_BE Register Response (đã unwrap envelope)
 * - Không trả về token khi register, user cần verify email rồi login
 */
export interface RegisterResponse {
  message: string;
}

/**
 * Zentaku_BE Verify Email Response
 */
export interface VerifyEmailResponse {
  message: string;
}

/**
 * Zentaku_BE Refresh Token Response (đã unwrap envelope)
 */
export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn?: number;
}

/**
 * Zentaku_BE Current User Response (GET /auth/me) (đã unwrap envelope)
 * Trả về thông tin user hiện tại dựa trên accessToken
 */
export interface CurrentUserResponse {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  gender?: string;
  birthday?: string;
  location?: string;
  website?: string;
  banner?: string;
  createdAt?: string;
}

// === USER TYPE (Zentaku_BE schema, camelCase) ===

/**
 * User interface chuẩn hóa theo Zentaku_BE (camelCase)
 * Dùng chung cho state management trong hooks
 */
export interface User {
  id?: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;    // Zentaku_BE: 'avatar' thay vì 'avatar_url'
  bio?: string;
  gender?: string;
  birthday?: string;
  location?: string;
  website?: string;
  banner?: string;
  createdAt?: string;

  // === DEPRECATED (backward compatibility) ===
  // Các trường cũ giữ lại tạm thời để không break UI components
  // sẽ được xóa khi Phase 5 hoàn tất cập nhật toàn bộ UI
  /** @deprecated Dùng 'avatar' thay thế */
  avatar_url?: string;
  /** @deprecated Dùng 'displayName' thay thế */
  first_name?: string;
  /** @deprecated Dùng 'displayName' thay thế */
  last_name?: string;
}

// === DEPRECATED (giữ lại để backward compatibility, sẽ xóa sau) ===

/**
 * @deprecated Zentaku_BE không sử dụng AuthTokens object.
 * Access token trả về trực tiếp, refresh token lưu qua HTTP-only cookie.
 */
export interface AuthTokens {
  access: string;
  refresh: string;
}