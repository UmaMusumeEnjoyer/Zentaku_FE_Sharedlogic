// src/components/InfoSidebar/useInfoSidebar.ts
import { useMemo } from 'react';
import { AnimeInfo } from './infoSidebar.types';

export const useInfoSidebar = (anime: AnimeInfo) => {
  
  // 1. Helper function format ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // 2. Logic tính toán thời gian phát sóng tập tiếp theo
  // Sử dụng useMemo để không phải tính lại trừ khi object next_airing_ep thay đổi
  const airingString = useMemo(() => {
    const nextEp = anime.nextAiringEpisode || anime.next_airing_ep;
    if (!nextEp) return null;
    
    const { episode, timeUntilAiring } = nextEp;
    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    
    return `Ep ${episode}: ${days}d ${hours}h`;
  }, [anime.nextAiringEpisode, anime.next_airing_ep]);

  return {
    formatDate,
    airingString
  };
};