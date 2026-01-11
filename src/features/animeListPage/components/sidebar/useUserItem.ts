import { useState, useEffect } from 'react';
import { userService } from '../../../../services/user.service';
import { SharedConfig } from '../../../../api/config';

const BACKEND_DOMAIN = SharedConfig.VITE_BACKEND_DOMAIN;
const DEFAULT_AVATAR = "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";

export const useUserItem = (
  username: string,
  initialAvatar?: string
) => {
  const [displayAvatar, setDisplayAvatar] = useState(DEFAULT_AVATAR);

  // Hàm xử lý URL ảnh
  const getAvatarUrl = (url?: string): string => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http')) return url;
    return `${BACKEND_DOMAIN}${url}`;
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
  }, [username, initialAvatar]);

  return {
    displayAvatar,
  };
};