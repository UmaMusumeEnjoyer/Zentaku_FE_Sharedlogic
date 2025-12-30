export declare const TTL_DEFAULT: number;
export declare const TTL_SHORT: number;
export declare function getCached<T>(key: string): T | null;
export declare function setCached(key: string, val: any, ttl?: number): void;
export declare const apiClient: import("axios").AxiosInstance;
//# sourceMappingURL=apiClient.d.ts.map