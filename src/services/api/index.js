// shared-logic/src/services/api/index.js

// 1. Export các config từ core
export { setAuthToken, setBaseUrl, logoutAPI } from './core';

// 2. Export các endpoint từ modules
export * from './modules/auth';
export * from './modules/anime';
export * from './modules/user';
export * from './modules/list';

// Bây giờ, khi import { login } from 'shared-logic/services/api', nó sẽ tự tìm vào modules/auth để lấy