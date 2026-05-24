export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}
export interface User {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    bio?: string;
    gender?: string;
    birthday?: string;
    location?: string;
}
export interface AuthTokens {
    access: string;
    refresh: string;
}
export interface LoginResponse {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    tokens?: AuthTokens;
    user: {
        username: string;
        email: string;
    };
}
//# sourceMappingURL=auth.types.d.ts.map