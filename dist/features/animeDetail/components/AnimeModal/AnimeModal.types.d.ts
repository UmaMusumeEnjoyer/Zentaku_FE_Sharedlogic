export interface Anime_Modal {
    id: string;
    cover_image: string;
    name_romaji: string;
    title?: {
        romaji?: string;
        english?: string;
    };
}
export interface UserStatusData_Modal {
    watch_status?: string;
    score?: number;
    episode_progress?: number;
    start_date?: string;
    finish_date?: string;
    total_rewatch?: number;
    user_note?: string;
    private?: boolean;
    isFavorite?: boolean;
    is_following?: boolean;
}
export interface EditorFormData {
    status: string;
    score: number;
    progress: number;
    startDate: string;
    finishDate: string;
    rewatches: number;
    notes: string;
    private: boolean;
    isFavorite: boolean;
}
export interface EditorModalProps {
    anime: Anime_Modal;
    isOpen: boolean;
    initialData?: UserStatusData_Modal | null;
    onClose: () => void;
    onSave: (data: any, isUpdateMode: boolean) => void;
    onDelete?: (animeId: number | string) => void;
}
export interface EditorModalHeaderProps {
    anime: Anime_Modal;
    onClose: () => void;
    onSave: () => void;
    isFavorite: boolean;
    toggleFavorite: () => void;
}
export interface EditorModalFormProps {
    formData: EditorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    isEditMode: boolean | undefined;
}
export interface EditorModalFooterProps {
    onDelete: () => void;
}
//# sourceMappingURL=AnimeModal.types.d.ts.map