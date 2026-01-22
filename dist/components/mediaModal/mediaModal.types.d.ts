import { ChangeEvent } from 'react';
export type MediaType = 'anime' | 'manga';
export interface MediaItem_Modal {
    id: number | string;
    cover_image: string;
    name_romaji: string;
    title?: {
        romaji?: string;
        english?: string;
    };
}
export interface UserStatusData_Modal {
    watch_status?: string;
    episode_progress?: number;
    read_status?: string;
    chapter_progress?: number;
    volume_progress?: number;
    status?: string;
    score?: number;
    start_date?: string;
    finish_date?: string;
    note?: string;
    user_note?: string;
    isFavorite?: boolean;
    total_rewatches_rereads?: number;
    total_rewatch?: number;
    private?: boolean;
    is_following?: boolean;
}
export interface EditorFormData {
    status: string;
    score: number;
    progress: number;
    volumes: number;
    startDate: string;
    finishDate: string;
    rewatches: number;
    notes: string;
    isFavorite: boolean;
    private: boolean;
}
export interface EditorModalProps {
    type: MediaType;
    item: MediaItem_Modal;
    isOpen: boolean;
    initialData?: UserStatusData_Modal | null;
    onClose: () => void;
    onSave: (data: any, isUpdateMode: boolean) => void;
    onDelete?: (id: number | string) => void;
}
export interface EditorModalHeaderProps {
    item: MediaItem_Modal;
    onClose: () => void;
    onSave: () => void;
    isFavorite: boolean;
    toggleFavorite: () => void;
}
export interface EditorModalFormProps {
    type: MediaType;
    formData: EditorFormData;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    isEditMode: boolean;
}
export interface EditorModalFooterProps {
    onDelete: () => void;
}
//# sourceMappingURL=mediaModal.types.d.ts.map