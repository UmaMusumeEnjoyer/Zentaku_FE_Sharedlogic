import { ChangeEvent, FormEvent } from 'react';
import { UserProfile, EditProfileFormData } from './EditProfileModal.types';
export declare const useEditProfileModal: (isOpen: boolean, currentUser: UserProfile | null, onUpdateSuccess: (user: UserProfile) => void, onClose: () => void) => {
    formData: EditProfileFormData;
    loading: boolean;
    error: string | null;
    fileInputRef: import("react").RefObject<HTMLInputElement>;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleUploadClick: () => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleAvatarDelete: () => Promise<void>;
    handleSubmit: (e: FormEvent) => Promise<void>;
};
//# sourceMappingURL=useEditProfileModal.d.ts.map