// shared-logic/src/features/profilePage/useProfileData.ts
import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
export const useProfileData = (options) => {
    const { routeUsername, loggedInUsername, onUserUpdate, onNavigate } = options;
    const targetUsername = routeUsername || loggedInUsername || "guest";
    const isOwnProfile = !routeUsername || (routeUsername === loggedInUsername);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!targetUsername)
            return;
        setLoading(true);
        userService.getUserProfile(targetUsername)
            .then((res) => setUserProfile(res.data))
            .catch((err) => console.error("Fetch profile failed", err))
            .finally(() => setLoading(false));
    }, [targetUsername]);
    const handleUpdateSuccess = (updatedUser) => {
        // Username changed → Navigate to new profile
        if (updatedUser.username !== (userProfile === null || userProfile === void 0 ? void 0 : userProfile.username)) {
            localStorage.setItem('username', updatedUser.username);
            // ✅ Gọi callback điều hướng (platform-specific)
            if (onNavigate) {
                onNavigate(`/user/${updatedUser.username}`);
            }
        }
        // Only name changed → Update local state
        else {
            setUserProfile(prev => prev ? Object.assign(Object.assign({}, prev), updatedUser) : updatedUser);
        }
        // ✅ Update context
        if (onUserUpdate) {
            onUserUpdate(updatedUser);
        }
    };
    return {
        userProfile,
        targetUsername,
        isOwnProfile,
        loading,
        handleUpdateSuccess
    };
};
//# sourceMappingURL=useProfileData.js.map