import { apiClient, getCached, setCached, TTL_DEFAULT } from '../api/apiClient';
import { searchService, SearchQueryParams } from './search.service';

// ====================================================================
// MAPPING FUNCTIONS (Backward Compatibility)
// Tự động map dữ liệu từ Zentaku_BE (camelCase) sang định dạng cũ (snake_case)
// để đảm bảo các component cũ vẫn hoạt động cho đến khi hoàn thành Phase 4/5.
// ====================================================================

const mapAnimeDetail = (data: any) => {
  if (!data) return data;
  return {
    ...data,
    // Map camelCase -> snake_case
    name_romaji: data.title?.romaji,
    name_english: data.title?.english,
    name_native: data.title?.native,
    title_romaji: data.title?.romaji,
    title_english: data.title?.english,
    title_native: data.title?.native,
    average_score: data.score,
    airing_episodes: data.episodes,
    cover_image: data.coverImage?.large || data.coverImage?.medium || data.coverImage,
    banner_image: data.bannerImage,
    cover_image_color: data.coverImage?.color,
  };
};

const mapOverview = (data: any) => {
  if (!data) return data;
  const mapped = mapAnimeDetail(data);

  // Map thêm relations, characters, staff nếu có
  if (mapped.characters?.edges) {
    mapped.characters = mapped.characters.edges.map((edge: any) => ({
      ...edge.node,
      role: edge.role,
      voiceActors: edge.voiceActors
    }));
  }

  if (mapped.staff?.edges) {
    mapped.staff = mapped.staff.edges.map((edge: any) => ({
      ...edge.node,
      role: edge.role
    }));
  }

  return mapped;
};

const mapCharacters = (data: any) => {
  // Zentaku_BE trả về mảng edges trực tiếp hoặc { edges: [] }
  const edges = Array.isArray(data) ? data : data?.edges;
  if (edges && Array.isArray(edges)) {
    return edges.map((edge: any) => {
      // Nếu edge đã là flat object thì giữ nguyên, ngược lại map từ node
      if (edge.node) {
        return {
          ...edge.node,
          role: edge.role,
          voiceActors: edge.voiceActors
        };
      }
      return edge;
    });
  }
  return data;
};

const mapStaff = (data: any) => {
  const edges = Array.isArray(data) ? data : data?.edges;
  if (edges && Array.isArray(edges)) {
    return edges.map((edge: any) => {
      if (edge.node) {
        return {
          ...edge.node,
          role: edge.role
        };
      }
      return edge;
    });
  }
  return data;
};

const mapStreamingLinks = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      ...item,
      // Map 'title' -> 'type'
      type: item.title || item.type
    }));
  }
  return data;
};

// ====================================================================
// ANIME SERVICE - Cập nhật cho Zentaku_BE
// ====================================================================

export const animeService = {
  // --- ANIME DETAIL ---
  getById: async (id: number | string): Promise<any> => {
    const key = `anime:${id}:detail`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    // Endpoint mới: /anilist/anime/{anilistId}
    const res = await apiClient.get(`/anilist/anime/${id}`);
    const mappedData = mapAnimeDetail(res.data);
    setCached(key, mappedData, TTL_DEFAULT);
    return { ...res, data: mappedData } as any;
  },

  // --- OVERVIEW ---
  getOverview: async (id: number | string): Promise<any> => {
    const key = `anime:${id}:overview`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    // Endpoint mới: /anilist/anime/{anilistId}/overview
    const res = await apiClient.get(`/anilist/anime/${id}/overview`);
    const mappedData = mapOverview(res.data);
    setCached(key, mappedData, TTL_DEFAULT);
    return { ...res, data: mappedData } as any;
  },

  // --- CHARACTERS ---
  getCharacters: async (id: number | string, page: number = 1, perPage: number = 25): Promise<any> => {
    const key = `anime:${id}:characters:${page}:${perPage}`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    // Endpoint mới: /anilist/anime/{anilistId}/characters?page=&perPage=
    const res = await apiClient.get(`/anilist/anime/${id}/characters`, {
      params: { page, perPage }
    });
    const mappedData = mapCharacters(res.data);
    setCached(key, mappedData, TTL_DEFAULT);
    return { ...res, data: mappedData } as any;
  },

  // --- STAFF ---
  getAnimeStaff: async (id: number | string, page: number = 1, perPage: number = 25): Promise<any> => {
    const key = `anime:${id}:staff:${page}:${perPage}`;
    const cached = getCached(key);
    if (cached) return { data: cached };
    
    // Endpoint mới: /anilist/anime/{anilistId}/staff?page=&perPage=
    const res = await apiClient.get(`/anilist/anime/${id}/staff`, {
      params: { page, perPage }
    });
    const mappedData = mapStaff(res.data);
    setCached(key, mappedData, TTL_DEFAULT);
    return { ...res, data: mappedData } as any;
  },

  // --- STATS ---
  getAnimeStats: async (id: number | string): Promise<any> => {
    const key = `anime:${id}:stats`;
    const cached = getCached(key);
    if (cached) return Promise.resolve({ data: cached });

    // Endpoint mới: /anilist/anime/{anilistId}/stats
    const res = await apiClient.get(`/anilist/anime/${id}/stats`);
    // Zentaku_BE bọc scoreDistribution, statusDistribution vào object stats
    // Cần giữ nguyên cấu trúc này hoặc map tùy yêu cầu, ở đây ta trả về luôn
    // vì nếu FE cần stats.scoreDistribution thì sẽ dùng res.data.stats
    // Nếu FE cũ dùng res.data.scoreDistribution, ta map lại cho an toàn:
    const mappedData = {
      ...res.data,
      scoreDistribution: res.data.stats?.scoreDistribution || res.data.scoreDistribution,
      statusDistribution: res.data.stats?.statusDistribution || res.data.statusDistribution,
    };
    
    setCached(key, mappedData, TTL_DEFAULT);
    return { ...res, data: mappedData } as any;
  },

  // --- WHERE TO WATCH ---
  getWhereToWatch: async (id: number | string): Promise<any> => {
    const key = `anime:${id}:watch`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    // Endpoint mới: /anilist/anime/{anilistId}/watch
    const res = await apiClient.get(`/anilist/anime/${id}/watch`);
    
    // Zentaku_BE trả về data là array các streaming links. Map title -> type.
    // Nếu FE cũ dùng { streaming_links: [...] }, ta tạo structure đó:
    const links = mapStreamingLinks(res.data?.data || res.data);
    const mappedData = {
      ...res.data,
      streaming_links: links
    };

    setCached(key, mappedData, TTL_DEFAULT);
    return { ...res, data: mappedData } as any;
  },

  // ====================================================================
  // API ĐÃ XÓA BỎ / DEPRECATED
  // Zentaku_BE không còn cung cấp các API lấy chi tiết character/staff
  // Trả về mock data hoặc ném lỗi có kiểm soát
  // ====================================================================

  getAnimeCharacter: async (_id: number | string): Promise<any> => {
    console.warn("⚠️ getAnimeCharacter API is removed in Zentaku_BE.");
    return Promise.resolve({ data: {} as any });
  },

  getStaffById: async (_id: number | string): Promise<any> => {
    console.warn("⚠️ getStaffById API is removed in Zentaku_BE.");
    return Promise.resolve({ data: {} as any });
  },

  // ====================================================================
  // SEARCH APIs (Chuyển sang search.service.ts, giữ wrapper cho tương thích ngược)
  // Sẽ được gỡ bỏ sau khi cập nhật hooks ở Phase 4
  // ====================================================================
  
  searchByName: async (keyword: string): Promise<any> => {
    // Map sang API mới
    const res = await searchService.searchAnime({ q: keyword });
    // Zentaku_BE trả về { data: Anime[] }
    // API cũ yêu cầu { data: { candidates: Anime[] } }
    const mappedData = { candidates: mapCharacters(res.data?.data || res.data) };
    return { ...res, data: mappedData };
  },

  getTrending: async (): Promise<any> => {
    const key = `search:trending`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    // Lấy trending anime qua API mới
    const res = await searchService.getTrending('ANIME');
    // API cũ yêu cầu { data: { trending: Anime[] } }
    const mappedData = { trending: mapCharacters(res.data?.data || res.data) };
    setCached(key, mappedData, TTL_DEFAULT);
    return { ...res, data: mappedData };
  },

  searchAnimeByCriteria: async (criteria: any): Promise<any> => {
    // Map old body params (search, perpage) to new query params (q, perPage)
    const params: SearchQueryParams = {
      ...criteria,
      q: criteria.search,
      perPage: criteria.perpage || criteria.perPage
    };
    
    const res = await searchService.searchAnime(params);
    // API cũ yêu cầu { data: { results: Anime[] } }
    // Zentaku_BE trả về { data: Anime[], pagination: {...} }
    const mappedData = { results: mapCharacters(res.data?.data || res.data) };
    return { ...res, data: mappedData };
  }
};