// src/features/home/hooks/useHomeLogic.ts
import { useState, useEffect } from 'react';
import { TRENDING_ANIME_MOCK, GENRES_MOCK, LATEST_NEWS_MOCK } from '../constants/homeConstants';
import { AnimeItem, NewsItem } from '../types/home.types';
// Sau này import animeService từ '../../../services/anime.service' vào đây

export const useHomeLogic = () => {
  // Giả lập state như khi gọi API thật
  const [trendingAnime, setTrendingAnime] = useState<AnimeItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập API call delay
    const loadData = async () => {
      setIsLoading(true);
      // Ở đây sau này sẽ là: await animeService.getTrending()
      setTimeout(() => {
        setTrendingAnime(TRENDING_ANIME_MOCK);
        setGenres(GENRES_MOCK);
        setLatestNews(LATEST_NEWS_MOCK);
        setIsLoading(false);
      }, 500);
    };

    loadData();
  }, []);

  return {
    trendingAnime,
    genres,
    latestNews,
    isLoading
  };
};
