// shared-logic/src/services/user.service.ts
import { apiClient, getCached, setCached, TTL_SHORT } from '../api/apiClient';
import { User } from '../features/authPage/auth.types';

// ====================================================================
// TYPE DEFINITIONS cho Zentaku_BE User Service
// ====================================================================

/** Dữ liệu cập nhật profile gửi lên PATCH /api/user/me */
export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  gender?: string;
  birthday?: string;
}

/** Cấu hình preferences gửi lên PATCH /api/user/me/preferences */
export interface UserPreferences {
  preferences?: {
    theme?: string;
    language?: string;
    timezone?: string;
    titleLanguage?: string;
    adultContent?: boolean;
  };
  notificationSettings?: {
    email?: boolean;
    push?: boolean;
    follows?: boolean;
    comments?: boolean;
    listUpdates?: boolean;
  };
}

/** Cấu hình privacy gửi lên PATCH /api/user/me/privacy */
export interface UserPrivacySettings {
  profileVisibility?: 'public' | 'private' | 'friends';
}

/** Zentaku_BE heatmap item: mảng { date, count } */
export interface HeatmapDataItem {
  date: string;   // "YYYY-MM-DD"
  count: number;
}

/** Zentaku_BE activity item (camelCase) */
export interface ActivityDataItem {
  id: string | number;
  actionType: string;
  targetId: string | number;
  agoSeconds?: number;
  metadata?: Record<string, any>;
  createdAt?: string;
}

/** Zentaku_BE paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// ====================================================================
// CACHING (giữ nguyên cơ chế cũ)
// ====================================================================
const animeStatusCache = new Map<string | number, any>();
const pendingRequests = new Map<string | number, Promise<any>>();

// ====================================================================
// USER SERVICE - Cập nhật cho Zentaku_BE
// ====================================================================
export const userService = {

  // ===========================
  // PROFILE
  // ===========================

  /**
   * Lấy profile của user hiện tại
   * GET /user/me
   * Zentaku_BE: sử dụng accessToken thay vì username trong path
   */
  getMyProfile: () => {
    return apiClient.get<User>('/user/me');
  },

  /**
   * Lấy profile theo username (public)
   * GET /users/{userId} hoặc tương tự
   * 
   * @deprecated Zentaku_BE ưu tiên dùng getMyProfile() cho user hiện tại.
   *             Giữ lại để backward compatibility cho các hook chưa cập nhật (Phase 4/5).
   *             Sẽ cần userId thay vì username trong tương lai.
   */
  getUserProfile: (username: string) => {
    // Backward compatibility: vẫn gọi endpoint cũ cho đến khi tất cả hooks được cập nhật
    return apiClient.get<User>(`/user/${username}/profile`);
  },

  /**
   * Cập nhật profile của user hiện tại
   * PATCH /user/me
   * Body: { displayName, bio, location, website, gender, birthday }
   */
  updateUserProfile: (userData: UpdateProfileData) => {
    return apiClient.patch<User>('/user/me', userData);
  },

  // ===========================
  // PREFERENCES & PRIVACY (MỚI)
  // ===========================

  /**
   * Cập nhật cấu hình hiển thị và thông báo
   * PATCH /user/me/preferences
   */
  updatePreferences: (data: UserPreferences) => {
    return apiClient.patch('/user/me/preferences', data);
  },

  /**
   * Cập nhật quyền riêng tư
   * PATCH /user/me/privacy
   */
  updatePrivacy: (data: UserPrivacySettings) => {
    return apiClient.patch('/user/me/privacy', data);
  },

  // ===========================
  // AVATAR / BANNER UPLOAD
  // ===========================

  /**
   * Upload avatar
   * POST /user/me/avatar
   * Multipart key: 'file' (thay vì 'avatar' như cũ)
   */
  uploadAvatar: (file: any) => {
    const formData = new FormData();
    formData.append('file', file); // Zentaku_BE: key = 'file'
    return apiClient.post('/user/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Upload banner (MỚI)
   * POST /user/me/banner
   * Multipart key: 'file'
   */
  uploadBanner: (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/user/me/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Xóa avatar
   * DELETE /user/me/avatar
   * (Cập nhật endpoint từ /user/avatar/delete/)
   */
  deleteUserAvatar: () => {
    return apiClient.delete('/user/me/avatar');
  },

  /**
   * Xóa banner (MỚI)
   * DELETE /user/me/banner
   */
  deleteUserBanner: () => {
    return apiClient.delete('/user/me/banner');
  },

  // ===========================
  // TRACKING / FOLLOW MEDIA
  // ===========================

  updateAnimeStatus: (animeId: number | string, data: any, isUpdate: boolean = false) => {
    const cacheKey = `anime_status_${animeId}`;
    animeStatusCache.delete(cacheKey);

    // Map old snake_case payload to new camelCase payload
    const mapStatus = (status: string) => {
      if (!status) return status;
      const s = status.toUpperCase();
      if (s === 'WATCHING' || s === 'READING') return 'CURRENT';
      return s;
    };

    const mappedData = {
      status: mapStatus(data.watch_status || data.read_status || data.status),
      progress: Number(data.episode_progress || data.chapter_progress || data.progress) || 0,
      progressVolumes: Number(data.volume_progress) || 0,
      score: Number(data.score) || 0,
      notes: data.user_note || data.note || data.notes || '',
      isPrivate: data.private !== undefined ? data.private : (data.isPrivate || false),
      rewatchCount: Number(data.total_rewatch || data.total_reread || data.rewatches) || 0,
      startDate: data.start_date || data.startDate || null,
      finishDate: data.finish_date || data.finishDate || null,
    };

    if (isUpdate) {
      return apiClient.patch(`/follows/media/${animeId}`, mappedData);
    } else {
      return apiClient.post(`/follows/media/${animeId}`, mappedData);
    }
  },

  getAnimeStatus: async (animeId: number | string) => {
    const cacheKey = `anime_status_${animeId}`;

    if (animeStatusCache.has(cacheKey)) {
      const cachedData = animeStatusCache.get(cacheKey);
      const now = Date.now();

      if (cachedData.timestamp && now - cachedData.timestamp < TTL_SHORT) {
        return cachedData.response;
      } else {
        animeStatusCache.delete(cacheKey);
      }
    }

    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    const requestPromise = apiClient.get(`/follows/media/${animeId}`)
      .then(response => {
        // Map new camelCase response to old snake_case format for backward compatibility
        if (response && response.data) {
          const d = response.data;
          
          // Map CURRENT back to watching/reading for frontend
          let oldStatus = d.status?.toLowerCase();
          if (oldStatus === 'current') oldStatus = 'watching'; // Assuming anime by default

          response.data = {
            ...d,
            watch_status: oldStatus,
            read_status: oldStatus,
            episode_progress: d.progress,
            chapter_progress: d.progress,
            volume_progress: d.progressVolumes,
            score: d.score,
            user_note: d.notes,
            note: d.notes,
            private: d.isPrivate,
            total_rewatch: d.rewatchCount,
            start_date: d.startDate,
            finish_date: d.finishDate,
            is_following: true
          };
        }

        animeStatusCache.set(cacheKey, {
          response,
          timestamp: Date.now()
        });
        pendingRequests.delete(cacheKey);
        return response;
      })
      .catch(error => {
        pendingRequests.delete(cacheKey);
        throw error;
      });

    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  },

  deleteAnimeStatus: (animeId: number | string) => {
    const cacheKey = `anime_status_${animeId}`;
    animeStatusCache.delete(cacheKey);
    return apiClient.delete(`/follows/media/${animeId}`);
  },

  // ===========================
  // USER FOLLOW (MỚI)
  // ===========================

  followUser: (targetUserId: string | number) => {
    return apiClient.post(`/follows/users/${targetUserId}`);
  },

  unfollowUser: (targetUserId: string | number) => {
    return apiClient.delete(`/follows/users/${targetUserId}`);
  },

  checkUserFollow: (targetUserId: string | number) => {
    return apiClient.get(`/follows/users/${targetUserId}`);
  },

  // ===========================
  // HEATMAP ACTIVITY
  // ===========================

  /**
   * Lấy dữ liệu heatmap theo userId
   * GET /users/{userId}/activities/heatmap?year=YYYY
   * Zentaku_BE trả về: { data: [{ date, count }] }
   * 
   * Hàm này tự động convert sang format cũ (counts object) cho backward compatibility
   * cho đến khi hooks/components được cập nhật ở Phase 4/5.
   */
  getHeatmap: async (userIdOrUsername: string, year?: number) => {
    const currentYear = year || new Date().getFullYear();
    const key = `user:${userIdOrUsername}:heatmap:${currentYear}`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/users/${userIdOrUsername}/activities/heatmap`, {
      params: { year: currentYear }
    });

    const rawData = res.data;

    // Zentaku_BE trả về mảng [{ date, count }]
    // Convert sang format cũ { counts: { "YYYY-MM-DD": number } } cho backward compatibility
    let normalizedData: any;
    if (Array.isArray(rawData)) {
      // Response là mảng trực tiếp (đã unwrap)
      const counts: Record<string, number> = {};
      rawData.forEach((item: HeatmapDataItem) => {
        counts[item.date] = item.count;
      });
      normalizedData = { counts };
    } else if (rawData?.data && Array.isArray(rawData.data)) {
      // Response có thêm wrapper { data: [...] }
      const counts: Record<string, number> = {};
      rawData.data.forEach((item: HeatmapDataItem) => {
        counts[item.date] = item.count;
      });
      normalizedData = { counts };
    } else if (rawData?.counts) {
      // Đã ở format cũ (fallback)
      normalizedData = rawData;
    } else {
      normalizedData = { counts: {} };
    }

    setCached(key, normalizedData, TTL_SHORT);
    return { data: normalizedData };
  },

  // ===========================
  // ACTIVITY LIST
  // ===========================

  /**
   * Lấy danh sách activities theo userId
   * GET /users/{userId}/activities?page=&perPage=&sort=
   * Zentaku_BE trả về: { data: Activity[], pagination: { ... } }
   * 
   * Tự động convert sang format cũ cho backward compatibility
   */
  getUserActivity: async (userIdOrUsername: string, page = 1, perPage = 50, sort = 'desc') => {
    const key = `user:${userIdOrUsername}:activity:${page}`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/users/${userIdOrUsername}/activities`, {
      params: { page, perPage, sort }
    });

    const rawData = res.data;

    // Zentaku_BE trả về { data: Activity[], pagination: {...} }
    // Convert sang format cũ { items: [...] } cho backward compatibility
    let normalizedData: any;
    if (Array.isArray(rawData)) {
      // Mảng trực tiếp
      normalizedData = { items: rawData, pagination: null };
    } else if (rawData?.data && Array.isArray(rawData.data)) {
      normalizedData = { items: rawData.data, pagination: rawData.pagination };
    } else if (rawData?.items) {
      // Đã ở format cũ (fallback)
      normalizedData = rawData;
    } else {
      normalizedData = { items: [], pagination: null };
    }

    setCached(key, normalizedData, TTL_SHORT);
    return { data: normalizedData };
  },

  // ===========================
  // USER ANIME LIST
  // (Giữ nguyên - sẽ cập nhật ở phase sau nếu cần)
  // ===========================

  getUserAnimeList: (username: string) => {
    // KHÔNG CACHE: List thay đổi thường xuyên khi user update
    return apiClient.get(`/user/${username}/animelist`);
  },

  // ===========================
  // USER SEARCH (ĐÃ XÓA BỎ)
  // ===========================

  /**
   * @deprecated Zentaku_BE không còn hỗ trợ tìm kiếm user công khai.
   * Giữ lại stub để không break build, sẽ xóa khi UI components được cập nhật.
   */
  searchUsers: (_keyword: string) => {
    console.warn('⚠️ searchUsers() is deprecated. Zentaku_BE does not support public user search.');
    return Promise.resolve({ data: { results: [] } });
  },
};