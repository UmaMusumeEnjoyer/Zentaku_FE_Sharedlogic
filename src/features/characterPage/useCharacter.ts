import { useState, useEffect } from 'react';
import { animeService } from '../../services/anime.service'; // Đường dẫn giả định
import { CharacterData, ExtraInfo } from './characterPage.types';

export const useCharacter = (characterId: string | undefined) => {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State cho dữ liệu đã qua xử lý
  const [extraInfo, setExtraInfo] = useState<ExtraInfo>({});
  const [cleanDescription, setCleanDescription] = useState<string>('');

  useEffect(() => {
    if (!characterId) return;

    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching character with ID:', characterId);
        
        const response = await animeService.getAnimeCharacter(characterId);
        console.log('Character response:', response);
        
        const data: CharacterData = response.data;
        console.log('Character data:', data);
        
        setCharacter(data);
        
        // Parse description nếu có
        if (data.description) {
          parseDescription(data.description);
        } else {
          setCleanDescription('');
        }
        
      } catch (err) {
        console.error("Failed to fetch character data:", err);
        setError("Failed to load character data.");
        setCharacter(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  // Logic tách thông tin phụ (Extra Info) ra khỏi description
  const parseDescription = (rawDescription: string) => {
    try {
      if (!rawDescription) {
        setCleanDescription('');
        return;
      }
      
      const lines = rawDescription.split('\n').filter(line => line.trim() !== '');
      const info: ExtraInfo = {};
      const descParts: string[] = [];

      lines.forEach(line => {
        const match = line.match(/^__(.*):__\s*(.*)/);
        if (match) {
          info[match[1]] = match[2];
        } else {
          descParts.push(line);
        }
      });

      setExtraInfo(info);
      setCleanDescription(descParts.join('\n\n'));
    } catch (err) {
      console.error('Error parsing description:', err);
      setCleanDescription(rawDescription || '');
    }
  };

  return { character, loading, error, extraInfo, cleanDescription };
};