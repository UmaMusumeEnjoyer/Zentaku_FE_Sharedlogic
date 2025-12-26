// src/constants/index.js

// 1. Export System Constants
export * from './system/storageKeys';
// export * from './system/regex'; // Ví dụ sau này

// 2. Export Options (Filters/Selects)
export { filterData as ANIME_FILTERS } from './options/animeFilters';

// 3. Export Static Content
export * from './content/newsData';

// 4. Export Mocks (Có thể comment lại khi build production)
export * from './mocks/animesearchMock';
export * from './mocks/animeSearchHeroMock';