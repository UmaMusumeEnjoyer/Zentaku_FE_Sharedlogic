export interface UserProfile {
    first_name: string | undefined;
    last_name: string;
    username: string;
    avatar_url?: string | undefined;
    [key: string]: any;
}
export interface EditProfileFormData {
    first_name: string;
    last_name: string;
    username: string;
}
export interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserProfile | null;
    onUpdateSuccess: (updatedUser: UserProfile) => void;
}
//# sourceMappingURL=EditProfileModal.types.d.ts.map