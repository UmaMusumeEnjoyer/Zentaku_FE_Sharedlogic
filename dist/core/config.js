export const SharedConfig = {
    storage: null,
    apiBaseUrl: 'https://doannguyen.pythonanywhere.com/api', // Default
};
// Hàm khởi tạo này sẽ được gọi ở index.js của Web và App.js của Mobile
export const initSharedLogic = (config) => {
    SharedConfig.storage = config.storage;
    if (config.apiBaseUrl) {
        SharedConfig.apiBaseUrl = config.apiBaseUrl;
    }
};
//# sourceMappingURL=config.js.map