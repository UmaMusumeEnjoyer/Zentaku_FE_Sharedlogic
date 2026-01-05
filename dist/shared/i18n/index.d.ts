export declare const NAMESPACES: readonly ["common", "HomePage", "NewsDetailPage", "RankingSection", "CharactersSection", "StaffSection", "CharacterPage", "StatisticsSection", "AnimeModal", "MainContentArea", "AnimeDetail", "Header", "GlobalSearch", "Auth", "StaffPage", "AnimeSearch", "HomePageLogin", "AnimeSection", "HomePageLogin"];
export declare const LANGUAGES: readonly ["en", "jp"];
export declare const DEFAULT_NS = "common";
export declare const DEFAULT_LANG = "en";
import common from './locales/en/common.json';
import HomePage from './locales/en/HomePage.json';
import CharacterPage from './locales/en/CharacterPage.json';
export interface I18nSchema {
    common: typeof common;
    HomePage: typeof HomePage;
    CharacterPage: typeof CharacterPage;
}
//# sourceMappingURL=index.d.ts.map