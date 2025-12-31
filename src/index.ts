// Export cấu hình để App khởi tạo
export { initSharedLogic, SharedConfig } from './api/config';

// Export các services
export * from './services/auth.service';
export * from './services/anime.service';
export * from './services/user.service';
export * from './services/list.service';
export * from './services/notification.service';

// Export features
export * from './features/home';
export * from './features/newsDetail';
export * from './features/animeDetail';

// Export i18n configuration và translations
export * from './shared/i18n';
export { default as commonEn } from './shared/i18n/locales/en/common.json';
export { default as homePageEn } from './shared/i18n/locales/en/HomePage.json';
export { default as commonJp } from './shared/i18n/locales/jp/common.json';
export { default as homePageJp } from './shared/i18n/locales/jp/HomePage.json';

export { default as newsDetailPageEn } from './shared/i18n/locales/en/NewsDetailPage.json';
export { default as newsDetailPageJp } from './shared/i18n/locales/jp/NewsDetailPage.json';

export { default as RankingSectionEn } from './shared/i18n/locales/en/RankingSection.json';
export { default as RankingSectionJp } from './shared/i18n/locales/jp/RankingSection.json';

export { default as charactersSectionJp } from './shared/i18n/locales/jp/CharactersSection.json';
export { default as charactersSectionEn } from './shared/i18n/locales/en/CharactersSection.json';

export * from './components/AnimeCard';