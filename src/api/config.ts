// Định nghĩa Interface cho Storage để Web (localStorage) và Mobile (AsyncStorage) đều dùng được
export interface IStorage {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
}

export const SharedConfig = {
  storage: null as IStorage | null,
  apiBaseUrl: 'https://doannguyen.pythonanywhere.com/api', // Default
};

// Hàm khởi tạo này sẽ được gọi ở index.js của Web và App.js của Mobile
export const initSharedLogic = (config: { storage: IStorage, apiBaseUrl?: string }) => {
  SharedConfig.storage = config.storage;
  if (config.apiBaseUrl) {
    SharedConfig.apiBaseUrl = config.apiBaseUrl;
  }
};