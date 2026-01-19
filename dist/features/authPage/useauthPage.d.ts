import { RegisterData } from './auth.types';
export interface UseAuthPageReturn {
    isActive: boolean;
    isLoading: boolean;
    registerData: RegisterData & {
        confirm_password: string;
    };
    loginData: {
        email: string;
        password: string;
    };
    handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRegisterSubmit: (e: React.FormEvent) => Promise<void>;
    handleLoginSubmit: (e: React.FormEvent) => Promise<void>;
    handleRegisterClick: () => void;
    handleLoginClick: () => void;
}
export interface UseAuthPageCallbacks {
    onLoginSuccess: (message: string) => void;
    onLoginError: (message: string) => void;
    onRegisterSuccess: (message: string) => void;
    onRegisterError: (message: string) => void;
    onVerifySuccess: (message: string) => void;
    onVerifyError: (message: string) => void;
    onNavigateToSignup: () => void;
    onNavigateToLogin: () => void;
    loginCallback: (email: string, password: string) => Promise<{
        success: boolean;
        message: string;
    }>;
}
export declare const useAuthPage: (callbacks: UseAuthPageCallbacks, initialPath?: "login" | "signup", verificationToken?: string | null) => UseAuthPageReturn;
//# sourceMappingURL=useauthPage.d.ts.map