// src/pages/AnimeDetail/useAnimeDetail.ts
import { useState, useEffect, useMemo } from 'react';
import { animeService } from '../../../services/anime.service'; // Đường dẫn import tùy thuộc cấu trúc của bạn
import { AnimeDetailData, AnimeDetailHook } from '../types/animeDetail.types';

export const useAnimeDetail = (animeId: string | undefined): AnimeDetailHook => {
  const [anime, setAnime] = useState<AnimeDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      if (!animeId) {
        setError("Anime ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await animeService.getById(animeId);
        setAnime(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết anime:", err);
        setError("Failed to load anime details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnime();
  }, [animeId]);

  // Logic tính toán derived state (state dẫn xuất)
  const hasBanner = useMemo(() => {
    return !!(anime && anime.banner_image);
  }, [anime]);

  return { anime, loading, error, hasBanner };
};