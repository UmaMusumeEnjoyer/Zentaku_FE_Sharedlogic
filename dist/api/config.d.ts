export interface IStorage {
    getItem: (key: string) => Promise<string | null> | string | null;
    setItem: (key: string, value: string) => Promise<void> | void;
    removeItem: (key: string) => Promise<void> | void;
}
export declare const SharedConfig: {
    storage: IStorage | null;
    apiBaseUrl: string;
    VITE_BACKEND_DOMAIN: string;
};
export declare const initSharedLogic: (config: {
    storage: IStorage;
    apiBaseUrl: string;
    VITE_BACKEND_DOMAIN: string;
}) => void;
//# sourceMappingURL=config.d.ts.map