var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/features/animeDetail/hooks/useAnimeStats.ts
import { useState, useEffect } from 'react';
import { animeService } from '../../../services/anime.service';
/**
 * Hook for fetching anime statistics including rankings, score and status distributions
 * @param animeId - The ID of the anime
 * @returns stats, loading state, and error state
 */
export const useAnimeStats = (animeId) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchStats = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!animeId)
                return;
            try {
                setLoading(true);
                setError(null);
                const response = yield animeService.getAnimeStats(animeId);
                setStats(response.data);
            }
            catch (err) {
                console.error("Error fetching anime stats:", err);
                setError("Failed to load anime statistics.");
            }
            finally {
                setLoading(false);
            }
        });
        fetchStats();
    }, [animeId]);
    return { stats, loading, error };
};
//# sourceMappingURL=useAnimeStats.js.map