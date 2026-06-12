import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { SharedConfig } from './config';

// --- CACHING UTILITIES (Giữ nguyên) ---
const simpleCache: Record<string, { val: any; exp: number }> = {};
export const TTL_DEFAULT = 1000 * 60 * 60;
export const TTL_SHORT = 1000 * 60 * 60;

export function getCached<T>(key: string): T | null {
  const entry = simpleCache[key];
  if (!entry) return null;
  if (Date.now() > entry.exp) {
    delete simpleCache[key];
    return null;
  }
  return entry.val;
}

export function setCached(key: string, val: any, ttl = TTL_DEFAULT) {
  simpleCache[key] = { val, exp: Date.now() + ttl };
}

// --- AXIOS INSTANCE ---
export const apiClient = axios.create({
  baseURL: SharedConfig.apiBaseUrl,
  withCredentials: true, // Gửi cookie HTTP-only cho refresh token
});

// Biến để tránh refresh nhiều lần đồng thời
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Danh sách các route không cần Authorization header ---
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/verify-email', '/auth/refresh-token'];

/**
 * Helper: Lấy token từ storage (SharedConfig.storage hoặc localStorage)
 */
export async function getStorageItem(key: string): Promise<string | null> {
  try {
    if (SharedConfig.storage) {
      return await SharedConfig.storage.getItem(key);
    } else if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch (err) {
    console.error(`Error retrieving "${key}" from storage:`, err);
  }
  return null;
}

/**
 * Helper: Lưu item vào storage
 */
async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    if (SharedConfig.storage) {
      await SharedConfig.storage.setItem(key, value);
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (err) {
    console.error(`Error saving "${key}" to storage:`, err);
  }
}

/**
 * Helper: Xóa item khỏi storage
 */
async function removeStorageItem(key: string): Promise<void> {
  try {
    if (SharedConfig.storage) {
      await SharedConfig.storage.removeItem(key);
    } else if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (err) {
    console.error(`Error removing "${key}" from storage:`, err);
  }
}

// ============================================================
// REQUEST INTERCEPTOR
// - Cập nhật baseURL nếu thay đổi
// - Đính kèm Authorization: Bearer <accessToken> từ storage
// ============================================================
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // 1. Cập nhật BaseURL nếu chưa đúng
  if (SharedConfig.apiBaseUrl && config.baseURL !== SharedConfig.apiBaseUrl) {
    config.baseURL = SharedConfig.apiBaseUrl;
  }

  // 2. Bỏ qua gắn token cho các route public
  const requestUrl = config.url || '';
  const isPublicRoute = PUBLIC_ROUTES.some(route => requestUrl.startsWith(route));

  if (!isPublicRoute) {
    // 3. Lấy accessToken từ Storage
    const token = await getStorageItem('accessToken');

    // 4. Gắn Token vào Header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => Promise.reject(error));

// ============================================================
// RESPONSE INTERCEPTOR
// - Tự động bóc tách envelope { success, data } của Zentaku_BE
// - Tự động refresh token khi gặp 401
// ============================================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Zentaku_BE trả về cấu trúc: { success: boolean, data: ... }
    // Tự động unwrap: gán response.data = response.data.data
    // để các service nhận được dữ liệu trực tiếp thay vì phải .data.data
    const body = response.data;
    if (
      body !== null &&
      typeof body === 'object' &&
      'success' in body &&
      'data' in body
    ) {
      response.data = body.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Kiểm tra nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Không retry nếu chính request refresh-token hoặc logout bị 401
      // Cũng không retry đối với các API public (ví dụ: /auth/login, /auth/register)
      const requestUrl = originalRequest.url || '';
      const isPublicRoute = PUBLIC_ROUTES.some(route => requestUrl.includes(route));

      if (
        isPublicRoute ||
        requestUrl.includes('/auth/logout')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh, đợi và retry với token mới
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh-token
        // Backend mới sử dụng HTTP-only cookie để gửi refresh token tự động.
        // Fallback: gửi refreshToken trong body cho môi trường không hỗ trợ cookie (React Native).
        const refreshToken = await getStorageItem('refreshToken');

        const refreshResponse = await axios.post(
          `${SharedConfig.apiBaseUrl}/auth/refresh-token`,
          refreshToken ? { refreshToken } : {},
          { withCredentials: true }
        );

        // Zentaku_BE trả về: { success: true, data: { accessToken: "..." } }
        // hoặc trực tiếp: { accessToken: "..." }
        const responseBody = refreshResponse.data;
        const newAccessToken =
          responseBody?.data?.accessToken ??
          responseBody?.accessToken ??
          responseBody?.data?.access ??
          responseBody?.access;

        if (!newAccessToken) {
          throw new Error('No access token received from refresh endpoint');
        }

        // Zentaku_BE không trả về refreshToken mới qua body (dùng cookie),
        // nhưng nếu có thì lưu lại (cho fallback)
        const newRefreshToken =
          responseBody?.data?.refreshToken ??
          responseBody?.refreshToken;

        // Lưu token mới
        await setStorageItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          await setStorageItem('refreshToken', newRefreshToken);
        }

        // Cập nhật header và retry các request đang chờ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Xóa token và thông báo logout
        await removeStorageItem('accessToken');
        await removeStorageItem('refreshToken');
        await removeStorageItem('username');

        // Trigger logout event (kiểm tra window tồn tại cho SSR/React Native)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);