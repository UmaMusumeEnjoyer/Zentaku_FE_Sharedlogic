var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/pages/AnimeDetail/useAnimeDetail.ts
import { useState, useEffect, useMemo, useRef } from 'react';
import { animeService } from '../../../services/anime.service';
export const useAnimeDetail = (animeId) => {
    // 1. Khai báo state cho stats
    const [stats, setStats] = useState(null);
    const [anime, setAnime] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [characterList, setCharacterList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Ref chặn gọi 2 lần (đã làm ở bước trước)
    const lastFetchedId = useRef(undefined);
    useEffect(() => {
        if (animeId === lastFetchedId.current)
            return;
        const fetchAllData = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (!animeId) {
                setError("Anime ID is missing");
                setLoading(false);
                return;
            }
            lastFetchedId.current = animeId;
            try {
                setLoading(true);
                setError(null);
                // 2. Gọi song song 4 API cùng lúc (bao gồm stats)
                const [animeRes, staffRes, charRes, statsRes] = yield Promise.all([
                    animeService.getById(animeId),
                    animeService.getAnimeStaff(animeId),
                    animeService.getCharacters(animeId),
                    animeService.getAnimeStats(animeId) // <-- Thêm dòng này
                ]);
                setAnime(animeRes.data);
                setStaffList(((_a = staffRes.data) === null || _a === void 0 ? void 0 : _a.staff) || []);
                setCharacterList(((_b = charRes.data) === null || _b === void 0 ? void 0 : _b.characters) || []);
                // 3. Lưu dữ liệu stats vào state
                setStats(statsRes.data);
            }
            catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError("Failed to load anime details.");
            }
            finally {
                setLoading(false);
            }
        });
        fetchAllData();
    }, [animeId]);
    const hasBanner = useMemo(() => {
        return !!(anime && anime.banner_image);
    }, [anime]);
    // 4. Trả về stats
    return { anime, loading, error, hasBanner, staffList, characterList, stats };
};
//# sourceMappingURL=useAnimeDetailPage.js.map