// src/features/animeDetail/hooks/useAnimeStats.ts
import { useState, useEffect } from 'react';
import { animeService } from '../../../../services/anime.service';
import { AnimeStats, UseAnimeStatsReturn } from './animeStats.types';

/**
 * Hook for fetching anime statistics including rankings, score and status distributions
 * @param animeId - The ID of the anime
 * @returns stats, loading state, and error state
 */
export const useAnimeStats = (animeId: number | string): UseAnimeStatsReturn => {
  const [stats, setStats] = useState<AnimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!animeId) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await animeService.getAnimeStats(animeId);
        setStats(response.data);
        
      } catch (err) {
        console.error("Error fetching anime stats:", err);
        setError("Failed to load anime statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [animeId]);

  return { stats, loading, error };
};
