// src/features/home/constants/homeConstants.ts
import { AnimeItem, NewsItem } from './home.types';

export const TRENDING_ANIME_MOCK: AnimeItem[] = [
  { id: 183385, title: 'This Monster Wants to Eat Me', img: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx123777-sdb3Fts3FlVH.jpg', desc: '"I\'ve come to eat you." So softly utters the mermaid...' },
  { id: 109287, title: 'Adachi and Shimamura', img: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx92550-gIC8HZR1cun2.jpg', desc: 'Adachi spends her school days skipping class until she meets fellow delinquent ...' },
  { id: 98444, title: 'Laid-Back Camp', img: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx98444-Vzysp1EsrzgD.jpg', desc: 'Rin likes to go camping by herself along the lakes that provide a scenic view of Mt. Fuji...' },
  { id: 113418, title: 'Super Cub', img: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113418-OjWcmCXAHWkq.jpg', desc: 'There\'s freedom in loneliness, and Koguma finds hers on a motorcycle. A Honda Super...' },
];

export const GENRES_MOCK = ['Shonen', 'Isekai', 'Slice of Life', 'Sci-Fi', 'Fantasy', 'Yuri'];

export const LATEST_NEWS_MOCK: NewsItem[] = [
  { id: 1, title: 'The umamusume season 3 incident', img: 'https://i.ytimg.com/vi/MIAMVvbdwfo/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCUYTUtJ8lKG83fVs68CrW5f3wizQ', snippet: 'The once-beloved horse girl anime returns with a season many are calling a critical failure...' },
  { id: 2, title: 'Slice-of-Life Masterpiece', img: 'https://www.anitrendz.com/_next/image?url=https%3A%2F%2Fi0.wp.com%2Fanitrendz.net%2Fnews%2Fwp-content%2Fuploads%2F2025%2F02%2FMono-PV1-screenshot.png%3Ffit%3D1920%252C1080%26ssl%3D1&w=1920&q=75', snippet: 'The soulful photography anime arrives and delivers what many are calling a perfect, generation-defining experience...' },
  { id: 3, title: 'Watashi wo Tabetai, Hitodenashi Wins "Yuri Anime of the Year"', img: 'https://preview.redd.it/watatabe-this-monster-wants-to-eat-me-episode-3-end-card-v0-tbfosusiv1wf1.jpeg?width=640&crop=smart&auto=webp&s=430642db068508c3b80d16fe9de638424d34608e', snippet: "The dark fantasy yuri didn't just raise the bar, it broke the whole scale, securing the community's highest honor..." },
];
