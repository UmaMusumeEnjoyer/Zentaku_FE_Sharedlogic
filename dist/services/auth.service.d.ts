import { LoginCredentials, LoginResponse, RegisterData } from '../features/authPage/auth.types';
type RegisterRequest = RegisterData & {
    confirmPassword: string;
};
export declare const authService: {
    login: (credentials: LoginCredentials) => Promise<import("axios").AxiosResponse<LoginResponse, any, {}>>;
    register: (userData: RegisterRequest) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    verifyEmail: (token: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    refreshToken: (refreshToken: string) => Promise<import("axios").AxiosResponse<{
        access: string;
        refresh: string;
    }, any, {}>>;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map