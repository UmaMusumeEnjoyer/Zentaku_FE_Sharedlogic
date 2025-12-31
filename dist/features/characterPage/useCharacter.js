var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect } from 'react';
import { animeService } from '../../services/anime.service'; // Đường dẫn giả định
export const useCharacter = (characterId) => {
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State cho dữ liệu đã qua xử lý
    const [extraInfo, setExtraInfo] = useState({});
    const [cleanDescription, setCleanDescription] = useState('');
    useEffect(() => {
        if (!characterId)
            return;
        const fetchCharacter = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching character with ID:', characterId);
                const response = yield animeService.getAnimeCharacter(characterId);
                console.log('Character response:', response);
                const data = response.data;
                console.log('Character data:', data);
                setCharacter(data);
                // Parse description nếu có
                if (data.description) {
                    parseDescription(data.description);
                }
                else {
                    setCleanDescription('');
                }
            }
            catch (err) {
                console.error("Failed to fetch character data:", err);
                setError("Failed to load character data.");
                setCharacter(null);
            }
            finally {
                setLoading(false);
            }
        });
        fetchCharacter();
    }, [characterId]);
    // Logic tách thông tin phụ (Extra Info) ra khỏi description
    const parseDescription = (rawDescription) => {
        try {
            if (!rawDescription) {
                setCleanDescription('');
                return;
            }
            const lines = rawDescription.split('\n').filter(line => line.trim() !== '');
            const info = {};
            const descParts = [];
            lines.forEach(line => {
                const match = line.match(/^__(.*):__\s*(.*)/);
                if (match) {
                    info[match[1]] = match[2];
                }
                else {
                    descParts.push(line);
                }
            });
            setExtraInfo(info);
            setCleanDescription(descParts.join('\n\n'));
        }
        catch (err) {
            console.error('Error parsing description:', err);
            setCleanDescription(rawDescription || '');
        }
    };
    return { character, loading, error, extraInfo, cleanDescription };
};
//# sourceMappingURL=useCharacter.js.map