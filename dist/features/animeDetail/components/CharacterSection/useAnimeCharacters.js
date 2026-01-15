// src/hooks/useAnimeCharacters.ts
import { useMemo } from 'react';
// Input bây giờ là list dữ liệu đã có
export const useAnimeCharacters = (fullCharacterList) => {
    // Logic nghiệp vụ: Lấy tối đa 6 nhân vật đầu tiên
    const characters = useMemo(() => {
        return fullCharacterList.slice(0, 6);
    }, [fullCharacterList]);
    return { characters };
};
//# sourceMappingURL=useAnimeCharacters.js.map