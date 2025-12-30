var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/hooks/useAnimeCharacters.ts
import { useState, useEffect } from 'react';
import { animeService } from '../../../../services/anime.service'; // Giữ đường dẫn import cũ của bạn
export const useAnimeCharacters = (animeId) => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCharacters = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!animeId)
                return;
            try {
                setLoading(true);
                const response = yield animeService.getCharacters(animeId);
                // Logic nghiệp vụ: Lấy tối đa 6 nhân vật đầu tiên
                // Kiểm tra an toàn để đảm bảo response.data.characters tồn tại
                const charList = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.characters) || [];
                setCharacters(charList.slice(0, 6));
            }
            catch (err) {
                console.error(err);
                setError(err);
            }
            finally {
                setLoading(false);
            }
        });
        fetchCharacters();
    }, [animeId]);
    return { characters, loading, error };
};
//# sourceMappingURL=useAnimeCharacters.js.map