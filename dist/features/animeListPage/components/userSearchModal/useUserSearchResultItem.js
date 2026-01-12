import { useState, useEffect, useMemo } from 'react';
import { userService } from '../../../../services/user.service';
export const useUserSearchResultItem = (user, currentMembers, isEditorMode, isProcessing, defaultAvatar, backendDomain) => {
    const fallbackAvatar = defaultAvatar || "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";
    const domain = backendDomain || "";
    const [displayAvatar, setDisplayAvatar] = useState(fallbackAvatar);
    // Helper xử lý URL
    const getAvatarUrl = (url) => {
        if (!url)
            return fallbackAvatar;
        if (url.startsWith('http'))
            return url;
        return `${domain}${url}`;
    };
    // Fetch avatar
    useEffect(() => {
        let isMounted = true;
        if (user.avatar || user.avatar_url) {
            setDisplayAvatar(getAvatarUrl(user.avatar || user.avatar_url));
        }
        if (user.username) {
            userService.getUserProfile(user.username)
                .then((res) => {
                if (isMounted && res.data && res.data.avatar_url) {
                    setDisplayAvatar(getAvatarUrl(res.data.avatar_url));
                }
            })
                .catch((err) => console.error(err));
        }
        return () => { isMounted = false; };
    }, [user.username, user.avatar, user.avatar_url, fallbackAvatar, domain]);
    // Tính toán trạng thái member
    const existingMember = useMemo(() => {
        return currentMembers.find(m => m.username === user.username);
    }, [currentMembers, user.username]);
    const isOwner = existingMember === null || existingMember === void 0 ? void 0 : existingMember.is_owner;
    // Tính toán trạng thái nút
    const buttonState = useMemo(() => {
        let btnText = "invite";
        let btnIcon = "person_add";
        let isDisabled = isProcessing || !!isOwner;
        let btnClass = isEditorMode ? 'editor' : 'viewer';
        if (existingMember) {
            if (isEditorMode) {
                // Mode Add Editor
                if (existingMember.can_edit) {
                    btnText = "joined";
                    btnIcon = "check";
                    isDisabled = true;
                }
                else {
                    btnText = "promote";
                    btnIcon = "arrow_upward";
                }
            }
            else {
                // Mode Add Viewer
                if (existingMember.can_edit) {
                    btnText = "demote";
                    btnIcon = "arrow_downward";
                }
                else {
                    btnText = "joined";
                    btnIcon = "check";
                    isDisabled = true;
                }
            }
        }
        return { text: btnText, icon: btnIcon, isDisabled, className: btnClass };
    }, [existingMember, isEditorMode, isProcessing, isOwner]);
    // Status text
    const statusText = useMemo(() => {
        if (existingMember) {
            const role = isOwner ? 'Owner' : (existingMember.can_edit ? 'Editor' : 'Viewer');
            return role;
        }
        return null;
    }, [existingMember, isOwner, isEditorMode]);
    return {
        displayAvatar,
        existingMember,
        isOwner,
        buttonState,
        statusText,
    };
};
//# sourceMappingURL=useUserSearchResultItem.js.map