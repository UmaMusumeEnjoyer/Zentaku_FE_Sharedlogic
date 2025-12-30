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

// Export i18n configuration và translations
export * from './shared/i18n';
export { default as commonEn } from './shared/i18n/locales/en/common.json';
export { default as homePageEn } from './shared/i18n/locales/en/HomePage.json';
export { default as commonJp } from './shared/i18n/locales/jp/common.json';
export { default as homePageJp } from './shared/i18n/locales/jp/HomePage.json';

export * from './components/AnimeCard';