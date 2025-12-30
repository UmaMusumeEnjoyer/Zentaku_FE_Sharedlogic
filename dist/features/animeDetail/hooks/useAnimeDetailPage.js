var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/features/anime/hooks/useAnimeDetailPage.ts
import { useState, useEffect } from 'react';
import { animeService } from '../../../services/anime.service'; // Đường dẫn import tùy thuộc cấu trúc thư mục của bạn
export const useAnimeDetailPage = (animeId) => {
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAnime = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!animeId)
                return;
            try {
                setLoading(true);
                const response = yield animeService.getById(animeId);
                // Giả định response.data khớp với interface AnimeData
                setAnime(response.data);
            }
            catch (error) {
                console.error("Lỗi khi lấy chi tiết anime:", error);
                setAnime(null);
            }
            finally {
                setLoading(false);
            }
        });
        fetchAnime();
    }, [animeId]);
    // Logic tính toán derived state
    const hasBanner = !!(anime === null || anime === void 0 ? void 0 : anime.banner_image);
    return {
        anime,
        loading,
        hasBanner,
        isNotFound: !anime && !loading, // Cờ trạng thái để UI dễ dàng kiểm tra
    };
};
//# sourceMappingURL=useAnimeDetailPage.js.map