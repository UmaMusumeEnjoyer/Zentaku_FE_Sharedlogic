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
import { useState, useEffect, useMemo } from 'react';
import { animeService } from '../../../services/anime.service'; // Đường dẫn import tùy thuộc cấu trúc của bạn
export const useAnimeDetail = (animeId) => {
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchAnime = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!animeId) {
                setError("Anime ID is missing");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const response = yield animeService.getById(animeId);
                setAnime(response.data);
            }
            catch (err) {
                console.error("Lỗi khi lấy chi tiết anime:", err);
                setError("Failed to load anime details.");
            }
            finally {
                setLoading(false);
            }
        });
        fetchAnime();
    }, [animeId]);
    // Logic tính toán derived state (state dẫn xuất)
    const hasBanner = useMemo(() => {
        return !!(anime && anime.banner_image);
    }, [anime]);
    return { anime, loading, error, hasBanner };
};
//# sourceMappingURL=useAnimeDetailPage.js.map