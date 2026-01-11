// src/features/home/types/home.types.ts

export interface AnimeItem {
  id: number | string;
  title: string;
  img: string;
  desc: string;
}

export interface NewsItem {
  id: number;
  title: string;
  img: string;
  snippet: string;
}
