// src/shared/i18n/index.ts

// 1. Định nghĩa danh sách Namespace (tương ứng với tên các file JSON)
export const NAMESPACES = ['common', 'HomePage'] as const;

// 2. Định nghĩa danh sách Ngôn ngữ
export const LANGUAGES = ['vi', 'en', 'jp'] as const;

// 3. Config mặc định
export const DEFAULT_NS = 'common';
export const DEFAULT_LANG = 'en';

// 4. (Tùy chọn) Export Types để hỗ trợ TypeScript ở Frontend
// Import mẫu một ngôn ngữ để lấy cấu trúc Type
import common from './locales/en/common.json';
import HomePage from './locales/en/HomePage.json';

export interface I18nSchema {
    common: typeof common;
    HomePage: typeof HomePage;
}