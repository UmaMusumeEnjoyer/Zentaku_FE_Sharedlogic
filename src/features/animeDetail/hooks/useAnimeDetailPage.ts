// src/pages/AnimeDetail/useAnimeDetail.ts
import { useState, useEffect, useMemo, useRef } from 'react';
import { animeService } from '../../../services/anime.service';
// Import các types cần thiết
import { AnimeDetailData, AnimeDetailHook } from '../types/animeDetail.types';
import { StaffMember } from '../components/StaffSection/staffSection.types';
import { Character } from '../components/CharacterSection/characterSection.types';
// Import type AnimeStats (kiểm tra đường dẫn import của bạn)
import { AnimeStats } from '../components/mainContentArea/animeStats.types'; 

interface UseAnimeDetailReturn extends AnimeDetailHook {
  staffList: StaffMember[];
  characterList: Character[];
  stats: AnimeStats | null; // Thêm type cho stats
  handleCharacterClick: () => void;
  handleStaffClick: () => void;
}

export const useAnimeDetail = (animeId: string | undefined): UseAnimeDetailReturn => {
  // 1. Khai báo state cho stats
  const [stats, setStats] = useState<AnimeStats | null>(null);
  
  const [anime, setAnime] = useState<AnimeDetailData | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ref chặn gọi 2 lần (đã làm ở bước trước)
  const lastFetchedId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (animeId === lastFetchedId.current) return;

    const fetchAllData = async () => {
      if (!animeId) {
        setError("Anime ID is missing");
        setLoading(false);
        return;
      }

      lastFetchedId.current = animeId;

      try {
        setLoading(true);
        setError(null);

        // 2. Gọi song song 4 API cùng lúc (bao gồm stats)
        const [animeRes, staffRes, charRes, statsRes] = await Promise.all([
          animeService.getById(animeId),
          animeService.getAnimeStaff(animeId),
          animeService.getCharacters(animeId),
          animeService.getAnimeStats(animeId) // <-- Thêm dòng này
        ]);

        setAnime(animeRes.data);
        setStaffList(staffRes.data?.staff || []);
        setCharacterList(charRes.data?.characters || []);
        
        // 3. Lưu dữ liệu stats vào state
        setStats(statsRes.data);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Failed to load anime details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [animeId]);

  const hasBanner = useMemo(() => {
    return !!(anime && anime.banner_image);
  }, [anime]);

  // Fallback clicks since API is removed in Zentaku_BE
  const handleCharacterClick = () => {
    alert("Character detail API has been removed in Zentaku_BE.");
  };

  const handleStaffClick = () => {
    alert("Staff detail API has been removed in Zentaku_BE.");
  };

  // 4. Trả về stats
  return { anime, loading, error, hasBanner, staffList, characterList, stats, handleCharacterClick, handleStaffClick };
};