import { useState, useEffect, useMemo } from 'react';
import { userService } from '../../../../services/user.service';
import { SearchUser, ListMember_userSearchModal as ListMember, ButtonState } from './userSearchModal.types';
import { SharedConfig } from '../../../../api/config';

const BACKEND_DOMAIN = SharedConfig.VITE_BACKEND_DOMAIN;
const DEFAULT_AVATAR = "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";

export const useUserSearchResultItem = (
  user: SearchUser,
  currentMembers: ListMember[],
  isEditorMode: boolean,
  isProcessing: boolean
) => {
  const [displayAvatar, setDisplayAvatar] = useState(DEFAULT_AVATAR);

  // Helper xử lý URL
  const getAvatarUrl = (url?: string): string => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http')) return url;
    return `${BACKEND_DOMAIN}${url}`;
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
  }, [user.username, user.avatar, user.avatar_url]);

  // Tính toán trạng thái member
  const existingMember = useMemo(() => {
    return currentMembers.find(m => m.username === user.username);
  }, [currentMembers, user.username]);

  const isOwner = existingMember?.is_owner;

  // Tính toán trạng thái nút
  const buttonState = useMemo((): ButtonState => {
    let btnText = "Invite";
    let btnIcon = "person_add";
    let isDisabled = isProcessing || !!isOwner;
    let btnClass = isEditorMode ? 'editor' : 'viewer';

    if (existingMember) {
      if (isEditorMode) {
        // Mode Add Editor
        if (existingMember.can_edit) {
          btnText = "Joined";
          btnIcon = "check";
          isDisabled = true;
        } else {
          btnText = "Promote";
          btnIcon = "arrow_upward";
        }
      } else {
        // Mode Add Viewer
        if (existingMember.can_edit) {
          btnText = "Demote";
          btnIcon = "arrow_downward";
        } else {
          btnText = "Joined";
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
      return `Currently: ${role}`;
    }
    return `Assign: ${isEditorMode ? 'Editor' : 'Viewer'}`;
  }, [existingMember, isOwner, isEditorMode]);

  return {
    displayAvatar,
    existingMember,
    isOwner,
    buttonState,
    statusText,
  };
};