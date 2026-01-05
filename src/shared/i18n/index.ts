// src/shared/i18n/index.ts

// 1. Định nghĩa danh sách Namespace (tương ứng với tên các file JSON)
export const NAMESPACES = ['common', 'HomePage', 'NewsDetailPage', 'RankingSection'
    , 'CharactersSection', 'StaffSection', 'CharacterPage', 'StatisticsSection'
    , 'AnimeModal', 'MainContentArea', 'AnimeDetail', 'Header'
    , 'GlobalSearch', 'Auth', 'StaffPage', 'AnimeSearch', 'HomePageLogin', 'AnimeSection'
    , 'HomePageLogin', 'AnimeListSearchPage', 'ActivityFeed'
] as const;

// 2. Định nghĩa danh sách Ngôn ngữ
export const LANGUAGES = ['en', 'jp'] as const;

// 3. Config mặc định
export const DEFAULT_NS = 'common';
export const DEFAULT_LANG = 'en';

// 4. (Tùy chọn) Export Types để hỗ trợ TypeScript ở Frontend
// Import mẫu một ngôn ngữ để lấy cấu trúc Type
import common from './locales/en/common.json';
import HomePage from './locales/en/HomePage.json';
import CharacterPage from './locales/en/CharacterPage.json';

export interface I18nSchema {
    common: typeof common;
    HomePage: typeof HomePage;
    CharacterPage: typeof CharacterPage;
}