var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// shared-logic/src/shared/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchUserInfo = useCallback((username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setIsLoading(true);
            const response = yield userService.getUserProfile(username);
            if (response.data) {
                setUser(response.data);
            }
        }
        catch (err) {
            console.error('Failed to fetch user info:', err);
            setError('Failed to fetch user information');
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    const login = useCallback((credentials) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            setIsLoading(true);
            setError(null);
            const response = yield authService.login(credentials);
            const accessToken = response.data.tokens.access;
            const refreshToken = response.data.tokens.refresh;
            const username = (_a = response.data.user) === null || _a === void 0 ? void 0 : _a.username;
            if (accessToken) {
                localStorage.setItem('authToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                if (username) {
                    localStorage.setItem('username', username);
                    yield fetchUserInfo(username);
                }
                return { success: true, message: 'Login successful!' };
            }
            else {
                return { success: false, message: 'Token not found in response' };
            }
        }
        catch (err) {
            const message = ((_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Login failed. Please try again.';
            setError(message);
            return { success: false, message };
        }
        finally {
            setIsLoading(false);
        }
    }), [fetchUserInfo]);
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        setUser(null);
        setError(null);
    }, []);
    const updateUserInState = useCallback((userData) => {
        setUser(prev => prev ? Object.assign(Object.assign({}, prev), userData) : null);
    }, []);
    return {
        user,
        isLoading,
        error,
        login,
        logout,
        fetchUserInfo,
        updateUserInState,
    };
};
//# sourceMappingURL=useAuth.js.map