// src/types/ranking.ts

export interface Ranking {
  id: number | string;
  rank: number;
  type: 'RATED' | 'POPULAR' | string; // Định nghĩa literal types nếu biết rõ các giá trị
  context: string;
  year: number | null;
  season: string | null;
  all_time?: boolean;
}