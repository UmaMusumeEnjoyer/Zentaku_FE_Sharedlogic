// src/types/anime.ts (hoặc src/components/.../types.ts)

export interface VoiceActor {
  id: number;
  name_full: string;
  language: string;
  image: string;
}

export interface Character {
  id: number;
  name_full: string;
  role: string;
  image: string;
  voice_actors?: VoiceActor[];
}