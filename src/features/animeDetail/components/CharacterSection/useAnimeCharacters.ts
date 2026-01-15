// src/hooks/useAnimeCharacters.ts
import { useMemo } from 'react';
import { Character } from './characterSection.types';

// Input bây giờ là list dữ liệu đã có
export const useAnimeCharacters = (fullCharacterList: Character[]) => {

  // Logic nghiệp vụ: Lấy tối đa 6 nhân vật đầu tiên
  const characters = useMemo(() => {
    return fullCharacterList.slice(0, 6);
  }, [fullCharacterList]);

  return { characters };
};