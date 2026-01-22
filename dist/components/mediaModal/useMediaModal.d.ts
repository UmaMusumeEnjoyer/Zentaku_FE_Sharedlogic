import { MediaItem_Modal, UserStatusData_Modal, EditorFormData, MediaType } from './mediaModal.types';
export declare const useMediaModal: (type: MediaType, item: MediaItem_Modal, initialData: UserStatusData_Modal | null | undefined, onSave: (data: any, isUpdateMode: boolean) => void, onDelete: ((id: number | string) => void) | undefined, onClose: () => void) => {
    formData: EditorFormData;
    isEditMode: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    toggleFavorite: () => void;
    handleSaveClick: () => Promise<void>;
    handleDeleteClick: () => Promise<void>;
};
//# sourceMappingURL=useMediaModal.d.ts.map