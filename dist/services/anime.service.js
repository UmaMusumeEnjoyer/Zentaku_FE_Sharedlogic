var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiClient, getCached, setCached } from '../api/apiClient';
export const animeService = {
    getById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `anime:${id}:detail`;
        const cached = getCached(key);
        if (cached)
            return { data: cached };
        const res = yield apiClient.get(`/anilist/anime/${id}/`);
        setCached(key, res.data);
        return res;
    }),
    getCharacters: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `anime:${id}:characters`;
        const cached = getCached(key);
        if (cached)
            return { data: cached };
        const res = yield apiClient.get(`/anilist/anime/${id}/characters/`);
        setCached(key, res.data);
        return res;
    }),
    getOverview: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `anime:${id}:overview`;
        const cached = getCached(key);
        if (cached)
            return { data: cached };
        const res = yield apiClient.get(`/anilist/anime/${id}/overview/`);
        setCached(key, res.data);
        return res;
    }),
    searchByName: (keyword) => {
        return apiClient.post('/anilist/search/name/', { name: keyword, manual: true });
    },
    getTrending: () => __awaiter(void 0, void 0, void 0, function* () {
        const key = `search:trending`;
        const cached = getCached(key);
        if (cached)
            return { data: cached };
        const res = yield apiClient.get('/anilist/search/trending/');
        setCached(key, res.data);
        return res;
    }),
    // ... Bạn có thể copy nốt các hàm getAnimeStaff, getAnimeStats vào đây tương tự
    getAnimeStaff: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `anime:${id}:staff`;
        const cached = getCached(key);
        if (cached)
            return { data: cached };
        const res = yield apiClient.get(`/anilist/anime/${id}/staffs/`);
        setCached(key, res.data);
        return res;
    }),
    getAnimeCharacter: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `character:${id}:detail`;
        const cached = getCached(key);
        if (cached)
            return { data: cached };
        const res = yield apiClient.get(`/anilist/character/${id}/`);
        setCached(key, res.data);
        return res;
    }),
    getAnimeStats: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `anime:${id}:stats`;
        const cached = getCached(key);
        if (cached)
            return Promise.resolve({ data: cached });
        const res = yield apiClient.get(`/anilist/anime/${id}/stats/`);
        setCached(key, res.data);
        return res;
    }),
    getStaffById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `staff:${id}:detail`;
        const cached = getCached(key);
        if (cached)
            return Promise.resolve({ data: cached });
        const res = yield apiClient.get(`/anilist/staff/${id}/`);
        setCached(key, res.data);
        return res;
    }),
    searchAnimeByCriteria: (criteria) => {
        return apiClient.post('/anilist/search/criteria/', criteria);
    }
};
//# sourceMappingURL=anime.service.js.map