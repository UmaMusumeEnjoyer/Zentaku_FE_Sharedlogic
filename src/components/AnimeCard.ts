// src/utils/animeLogic.ts

// 1. Định nghĩa Interface cho dữ liệu Anime đầu vào
export interface AnimeData {
  id?: number | string;
  anilist_id?: number | string;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  title_romaji?: string;
  name_romaji?: string;
  name_native?: string;
  name_english?: string;
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    color?: string;
  };
  cover_image?: string;
  episode_progress?: number;
  episodes?: number;
  next_airing_ep?: {
    episode: number;
    timeUntilAiring: number;
  };
}

// 2. Logic lấy tiêu đề theo ngôn ngữ
export const getAnimeTitle = (anime: AnimeData, language: 'en' | 'jp' = 'en'): string => {
  if (language === 'jp') {
    return anime.title?.native || anime.name_native || anime.title?.romaji || anime.name_romaji || anime.title_romaji || anime.title?.english || anime.name_english || "Unknown Title";
  } else {
    return anime.title?.english || anime.name_english || anime.title?.romaji || anime.name_romaji || anime.title_romaji || anime.title?.native || anime.name_native || "Unknown Title";
  }
};

// 3. Logic lấy ID cho Link
export const getAnimeLinkId = (anime: AnimeData): number | string => {
  return anime.anilist_id || anime.id || "";
};

// 4. Logic tính toán thông tin hiển thị (Watched hoặc Airing)
export const getAnimeDisplayInfo = (anime: AnimeData): string | null => {
  // Case A: Đang xem dở (Watched progress)
  if (anime.episode_progress !== undefined) {
    const currentEp = anime.episode_progress;
    const totalEp = anime.episodes || '?';
    return `Watched: ${currentEp} / ${totalEp}`;
  } 
  
  // Case B: Chuẩn bị chiếu tập mới (Next Airing)
  if (anime.next_airing_ep) {
    const { episode, timeUntilAiring } = anime.next_airing_ep;
    
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