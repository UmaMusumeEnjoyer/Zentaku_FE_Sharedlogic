import { User, LoginCredentials } from './auth.types';
export interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<{
        success: boolean;
        message: string;
    }>;
    logout: () => void;
    fetchUserInfo: (username: string) => Promise<void>;
    updateUserInState: (userData: Partial<User>) => void;
}
export declare const useAuth: () => UseAuthReturn;
//# sourceMappingURL=useAuth.d.ts.map