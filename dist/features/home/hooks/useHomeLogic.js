var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/features/home/hooks/useHomeLogic.ts
import { useState, useEffect } from 'react';
import { TRENDING_ANIME_MOCK, GENRES_MOCK, LATEST_NEWS_MOCK } from '../constants/homeConstants';
// Sau này import animeService từ '../../../services/anime.service' vào đây
export const useHomeLogic = () => {
    // Giả lập state như khi gọi API thật
    const [trendingAnime, setTrendingAnime] = useState([]);
    const [genres, setGenres] = useState([]);
    const [latestNews, setLatestNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Giả lập API call delay
        const loadData = () => __awaiter(void 0, void 0, void 0, function* () {
            setIsLoading(true);
            // Ở đây sau này sẽ là: await animeService.getTrending()
            setTimeout(() => {
                setTrendingAnime(TRENDING_ANIME_MOCK);
                setGenres(GENRES_MOCK);
                setLatestNews(LATEST_NEWS_MOCK);
                setIsLoading(false);
            }, 500);
        });
        loadData();
    }, []);
    return {
        trendingAnime,
        genres,
        latestNews,
        isLoading
    };
};
//# sourceMappingURL=useHomeLogic.js.map