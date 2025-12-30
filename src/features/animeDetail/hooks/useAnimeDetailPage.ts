// src/features/anime/hooks/useAnimeDetailPage.ts
import { useState, useEffect } from 'react';
import { animeService } from '../../../services/anime.service'; // Đường dẫn import tùy thuộc cấu trúc thư mục của bạn
import { AnimeData, UseAnimeDetailReturn } from '../types/animeDetail.types';

export const useAnimeDetailPage = (animeId?: string): UseAnimeDetailReturn => {
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnime = async () => {
      if (!animeId) return;

      try {
        setLoading(true);
        const response = await animeService.getById(animeId);
        // Giả định response.data khớp với interface AnimeData
        setAnime(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết anime:", error);
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnime();
  }, [animeId]);

  // Logic tính toán derived state
  const hasBanner = !!anime?.banner_image;

  return {
    anime,
    loading,
    hasBanner,
    isNotFound: !anime && !loading, // Cờ trạng thái để UI dễ dàng kiểm tra
  };
};