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
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            setIsLoading(true);
            setError(null);
            const response = yield authService.login(credentials);
            const responseData = response.data;
            const accessToken = (_a = responseData.accessToken) !== null && _a !== void 0 ? _a : (_b = responseData.tokens) === null || _b === void 0 ? void 0 : _b.access;
            const refreshToken = (_c = responseData.refreshToken) !== null && _c !== void 0 ? _c : (_d = responseData.tokens) === null || _d === void 0 ? void 0 : _d.refresh;
            const username = (_e = responseData.user) === null || _e === void 0 ? void 0 : _e.username;
            if (accessToken) {
                localStorage.setItem('authToken', accessToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }
                if (username) {
                    localStorage.setItem('username', username);
                    //await fetchUserInfo(username);
                    fetchUserInfo(username).catch(err => console.error(err));
                }
                return { success: true, message: 'Login successful!' };
            }
            else {
                return { success: false, message: 'Token not found in response' };
            }
        }
        catch (err) {
            const message = ((_g = (_f = err.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) || 'Login failed. Please try again.';
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
        setUser(prev => {
            if (!prev) {
                return userData;
            }
            // ✅ Create completely new object to ensure React detects change
            const updated = Object.assign(Object.assign(Object.assign({}, prev), userData), { 
                // Ensure important fields are properly updated
                avatar_url: userData.avatar_url !== undefined ? userData.avatar_url : prev.avatar_url, username: userData.username !== undefined ? userData.username : prev.username, first_name: userData.first_name !== undefined ? userData.first_name : prev.first_name, last_name: userData.last_name !== undefined ? userData.last_name : prev.last_name });
            return updated;
        });
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