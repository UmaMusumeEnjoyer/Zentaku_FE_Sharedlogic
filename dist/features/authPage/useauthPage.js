var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// src/features/authPage/useauthPage.ts
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
export const useAuthPage = (callbacks, initialPath, verificationToken) => {
    const [isActive, setIsActive] = useState(initialPath === 'signup');
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
    // Email verification logic on mount
    useEffect(() => {
        const verifyToken = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (verificationToken) {
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
        try {
            const { confirm_password } = registerData, dataToSend = __rest(registerData, ["confirm_password"]);
            const response = yield authService.register(dataToSend);
            callbacks.onRegisterSuccess(response.data.message || 'Registration successful!');
            callbacks.onNavigateToLogin();
        }
        catch (error) {
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
    });
    const handleLoginSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const result = yield callbacks.loginCallback(loginData.email, loginData.password);
        if (result.success) {
            callbacks.onLoginSuccess(result.message);
        }
        else {
            callbacks.onLoginError(result.message);
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