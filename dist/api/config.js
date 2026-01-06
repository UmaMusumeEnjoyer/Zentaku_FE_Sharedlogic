export const SharedConfig = {
    storage: null,
    apiBaseUrl: '', // Bắt buộc phải được set qua initSharedLogic,
    VITE_BACKEND_DOMAIN: ''
};
// Hàm khởi tạo này sẽ được gọi ở index.js của Web và App.js của Mobile
export const initSharedLogic = (config) => {
    if (!config.apiBaseUrl) {
        throw new Error('apiBaseUrl is required. Please provide it via initSharedLogic()');
    }
    if (!config.storage) {
        throw new Error('storage is required. Please provide it via initSharedLogic()');
    }
    SharedConfig.storage = config.storage;
    SharedConfig.apiBaseUrl = config.apiBaseUrl;
    SharedConfig.VITE_BACKEND_DOMAIN = config.VITE_BACKEND_DOMAIN;
};
//# sourceMappingURL=config.js.map