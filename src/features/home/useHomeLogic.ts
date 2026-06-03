// src/features/home/hooks/useHomeLogic.ts
import { useState, useEffect } from 'react';
import { GENRES_MOCK, LATEST_NEWS_MOCK } from './homeConstants';
import { NewsItem } from './home.types';
import { animeService } from '../../services/anime.service';
import type { AnimeData } from '../../components/AnimeCard';

export const useHomeLogic = () => {
  const [trendingAnime, setTrendingAnime] = useState<AnimeData[]>([]);
  const [scheduledAnime, setScheduledAnime] = useState<AnimeData[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [trendingRes, scheduleRes] = await Promise.all([
          animeService.getTrendingAnime(1, 15),
          animeService.getAnimeSchedule()
        ]);
        
        // Zentaku_BE response structure handling
        setTrendingAnime(trendingRes.data?.data || trendingRes.data || []);
        
        // Schedule response might be a list directly or under data
        setScheduledAnime(scheduleRes.data?.data || scheduleRes.data || []);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setGenres(GENRES_MOCK);
        setLatestNews(LATEST_NEWS_MOCK);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    trendingAnime,
    scheduledAnime,
    genres,
    latestNews,
    isLoading
  };
};
