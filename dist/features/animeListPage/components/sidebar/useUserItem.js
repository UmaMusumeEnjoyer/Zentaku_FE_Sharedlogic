import { useState, useEffect } from 'react';
import { userService } from '../../../../services/user.service';
export const useUserItem = (username, initialAvatar, defaultAvatar, backendDomain) => {
    const fallbackAvatar = defaultAvatar || "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";
    const domain = backendDomain || "";
    const [displayAvatar, setDisplayAvatar] = useState(fallbackAvatar);
    // Hàm xử lý URL ảnh
    const getAvatarUrl = (url) => {
        if (!url)
            return fallbackAvatar;
        if (url.startsWith('http'))
            return url;
        return `${domain}${url}`;
    };
    useEffect(() => {
        let isMounted = true;
        // Hiển thị avatar có sẵn trước
        if (initialAvatar) {
            setDisplayAvatar(getAvatarUrl(initialAvatar));
        }
        // Fetch avatar mới nhất từ API
        if (username) {
            userService.getUserProfile(username)
                .then((res) => {
                if (isMounted && res.data && res.data.avatar_url) {
                    setDisplayAvatar(getAvatarUrl(res.data.avatar_url));
                }
            })
                .catch((err) => {
                console.error(`Failed to fetch profile for ${username}`, err);
            });
        }
        return () => { isMounted = false; };
    }, [username, initialAvatar, fallbackAvatar, domain]);
    return {
        displayAvatar,
    };
};
//# sourceMappingURL=useUserItem.js.map