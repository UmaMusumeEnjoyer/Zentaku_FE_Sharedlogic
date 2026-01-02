import { LoginCredentials, LoginResponse, RegisterData } from '../features/authPage/auth.types';
export declare const authService: {
    login: (credentials: LoginCredentials) => Promise<import("axios").AxiosResponse<LoginResponse, any, {}>>;
    register: (userData: RegisterData) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    verifyEmail: (token: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
//# sourceMappingURL=auth.service.d.ts.map