export interface UserProfile {
  username: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  gender?: string;
  birthday?: string;
  avatar?: string;
  banner?: string;

  // Backward compatibility (deprecated, sẽ xóa khi Phase 5 hoàn tất)
  /** @deprecated Dùng 'avatar' thay thế */
  avatar_url?: string | undefined;
  /** @deprecated Dùng 'displayName' thay thế */
  first_name?: string | undefined;
  /** @deprecated Dùng 'displayName' thay thế */
  last_name?: string;
  [key: string]: any;
}

export interface EditProfileFormData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  gender: string;
  birthday: string;
  // Backward compatibility
  /** @deprecated */
  first_name?: string;
  /** @deprecated */
  last_name?: string;
  username?: string;
}

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUpdateSuccess: (updatedUser: UserProfile) => void;
}