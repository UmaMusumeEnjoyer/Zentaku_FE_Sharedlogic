// src/utils/animeLogic.ts

// 1. Định nghĩa Interface cho dữ liệu Anime đầu vào (Zentaku_BE camelCase)
export interface AnimeData {
  id?: number | string;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    color?: string;
  };
  progress?: number;
  episodes?: number;
  nextAiringEpisode?: {
    episode: number;
    timeUntilAiring: number;
    airingAt?: number;
  };
}

// 2. Logic lấy tiêu đề theo ngôn ngữ
export const getAnimeTitle = (anime: AnimeData, language: 'en' | 'jp' = 'en'): string => {
  if (language === 'jp') {
    return anime.title?.native || anime.title?.romaji || anime.title?.english || "Unknown Title";
  } else {
    return anime.title?.english || anime.title?.romaji || anime.title?.native || "Unknown Title";
  }
};

// 3. Logic lấy ID cho Link
export const getAnimeLinkId = (anime: AnimeData): number | string => {
  return anime.id || "";
};

// 4. Logic tính toán thông tin hiển thị (Watched hoặc Airing)
export const getAnimeDisplayInfo = (anime: AnimeData): string | null => {
  // Case A: Đang xem dở (Watched progress)
  if (anime.progress !== undefined && anime.progress > 0) {
    const currentEp = anime.progress;
    const totalEp = anime.episodes || '?';
    return `Watched: ${currentEp} / ${totalEp}`;
  } 
  
  // Case B: Chuẩn bị chiếu tập mới (Next Airing)
  if (anime.nextAiringEpisode) {
    const { episode, timeUntilAiring } = anime.nextAiringEpisode;
    
    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    const minutes = Math.floor(((timeUntilAiring % 86400) % 3600) / 60);

    let timeString = `${days}d ${hours}h ${minutes}m`;
    if (days === 0) {
      timeString = `${hours}h ${minutes}m`;
    }
    return `Ep ${episode} - ${timeString}`;
  }

  // Case C: Không có thông tin
  return null;
};