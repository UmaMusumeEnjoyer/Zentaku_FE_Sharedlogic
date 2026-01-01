import { Anime_Modal, UserStatusData_Modal, EditorFormData } from './AnimeModal.types';
export declare const useEditorModal: (anime: Anime_Modal, initialData: UserStatusData_Modal | null | undefined, onSave: (data: any, isUpdateMode: boolean) => void, onDelete: ((id: number | string) => void) | undefined, onClose: () => void) => {
    formData: EditorFormData;
    isEditMode: boolean | undefined;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    toggleFavorite: () => void;
    handleSaveClick: () => Promise<void>;
    handleDeleteClick: () => Promise<void>;
};
//# sourceMappingURL=useEditorModal.d.ts.map