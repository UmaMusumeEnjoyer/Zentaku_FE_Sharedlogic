var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/features/authPage/useauthPage.ts
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
export const useAuthPage = (callbacks, initialPath, verificationToken) => {
    const [isActive, setIsActive] = useState(initialPath === 'signup');
    const [isLoading, setIsLoading] = useState(false); // 2. Khởi tạo state isLoading
    // ... (Giữ nguyên phần useState data và useEffect) ...
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    // Email verification logic on mount (Giữ nguyên)
    useEffect(() => {
        const verifyToken = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (verificationToken) {
                setIsLoading(true); // Có thể thêm loading khi verify
                try {
                    yield authService.verifyEmail(verificationToken);
                    callbacks.onVerifySuccess("Email verified successfully! Please login.");
                    callbacks.onNavigateToLogin();
                }
                catch (error) {
                    const errorMsg = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Verification failed.";
                    callbacks.onVerifyError(errorMsg);
                    callbacks.onNavigateToLogin();
                }
                finally {
                    setIsLoading(false);
                }
            }
        });
        verifyToken();
    }, [verificationToken]);
    const handleRegisterChange = (e) => {
        setRegisterData(Object.assign(Object.assign({}, registerData), { [e.target.name]: e.target.value }));
    };
    const handleLoginChange = (e) => {
        setLoginData(Object.assign(Object.assign({}, loginData), { [e.target.name]: e.target.value }));
    };
    const handleRegisterSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        if (registerData.password !== registerData.confirm_password) {
            callbacks.onRegisterError("Passwords do not match!");
            return;
        }
        setIsLoading(true); // 3. Bật loading
        try {
            const response = yield authService.register(registerData);
            callbacks.onRegisterSuccess(response.data.message || 'Registration successful!');
            callbacks.onNavigateToLogin();
        }
        catch (error) {
            // ... (Giữ nguyên logic xử lý lỗi) ...
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
                const errorData = error.response.data;
                if (errorData.details) {
                    Object.values(errorData.details).forEach((messages) => {
                        messages.forEach((msg) => callbacks.onRegisterError(msg));
                    });
                }
                else if (errorData.error) {
                    callbacks.onRegisterError(errorData.error);
                }
                else {
                    callbacks.onRegisterError('An unexpected error occurred.');
                }
            }
            else {
                callbacks.onRegisterError('Unable to connect to the server.');
            }
        }
        finally {
            setIsLoading(false); // 4. Tắt loading
        }
    });
    const handleLoginSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setIsLoading(true); // 5. Bật loading
        try {
            const result = yield callbacks.loginCallback(loginData.email, loginData.password);
            if (result.success) {
                callbacks.onLoginSuccess(result.message);
            }
            else {
                callbacks.onLoginError(result.message);
            }
        }
        catch (error) {
            callbacks.onLoginError("Login failed unexpectedly.");
        }
        finally {
            setIsLoading(false); // 6. Tắt loading
        }
    });
    const handleRegisterClick = () => {
        setIsActive(true);
        callbacks.onNavigateToSignup();
    };
    const handleLoginClick = () => {
        setIsActive(false);
        callbacks.onNavigateToLogin();
    };
    return {
        isActive,
        isLoading, // 7. Return isLoading
        registerData,
        loginData,
        handleRegisterChange,
        handleLoginChange,
        handleRegisterSubmit,
        handleLoginSubmit,
        handleRegisterClick,
        handleLoginClick,
    };
};
//# sourceMappingURL=useauthPage.js.map