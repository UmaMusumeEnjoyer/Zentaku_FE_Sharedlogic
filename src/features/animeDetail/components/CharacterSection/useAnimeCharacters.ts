// src/hooks/useAnimeCharacters.ts
import { useState, useEffect } from 'react';
import { animeService } from '../../../../services/anime.service'; // Giữ đường dẫn import cũ của bạn
import { Character } from './characterSection.types'; // Import type vừa tạo

export const useAnimeCharacters = (animeId: number | string | undefined) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!animeId) return;

      try {
        setLoading(true);
        const response = await animeService.getCharacters(animeId);
        
        // Logic nghiệp vụ: Lấy tối đa 6 nhân vật đầu tiên
        // Kiểm tra an toàn để đảm bảo response.data.characters tồn tại
        const charList = response.data?.characters || [];
        setCharacters(charList.slice(0, 6));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [animeId]);

  return { characters, loading, error };
};