// src/features/animeDetail/types/animeStats.types.ts

import { Ranking } from '../RankingSection/rankingSection.types';
import { ScoreItem } from '../StatisticsSection/StatisticsSection.types.Score';
import { StatusItem } from '../StatisticsSection/StatisticsSection.types.Status';

/**
 * Interface for complete anime statistics
 * Contains rankings, score distribution, and status distribution
 */
export interface AnimeStats {
  rankings: Ranking[];
  score_distribution: ScoreItem[];
  status_distribution: StatusItem[];
}

/**
 * Return type for useAnimeStats hook
 */
export interface UseAnimeStatsReturn {
  stats: AnimeStats | null;
  loading: boolean;
  error: string | null;
}
