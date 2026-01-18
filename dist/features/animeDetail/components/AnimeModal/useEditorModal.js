var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/components/EditorModal/useEditorModal.ts
import { useState, useEffect } from 'react';
import { userService } from '../../../../services/user.service';
export const useEditorModal = (anime, initialData, onSave, onDelete, onClose) => {
    const isEditMode = !!initialData && initialData.is_following;
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [formData, setFormData] = useState({
        status: 'plan_to_watch',
        score: 0,
        progress: 0,
        startDate: getTodayDate(),
        finishDate: '',
        rewatches: 0,
        notes: '',
        private: false,
        isFavorite: false
    });
    // Load data khi mở modal
    useEffect(() => {
        if (initialData) {
            setFormData({
                status: initialData.watch_status || 'plan_to_watch',
                score: initialData.score || 0,
                progress: initialData.episode_progress || 0,
                startDate: initialData.start_date || getTodayDate(),
                finishDate: initialData.finish_date || '',
                rewatches: initialData.total_rewatch || 0,
                notes: initialData.user_note || '',
                private: initialData.private || false,
                isFavorite: initialData.isFavorite || false
            });
        }
    }, [initialData]);
    const handleChange = (e) => {
        const target = e.target; // Type casting để truy cập checked
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [target.name]: value })));
    };
    const toggleFavorite = () => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { isFavorite: !prev.isFavorite })));
    };
    const handleSaveClick = () => __awaiter(void 0, void 0, void 0, function* () {
        if (isEditMode) {
            // Logic UPDATE
            const updatePayload = {
                episode_progress: Number(formData.progress) || 0,
                watch_status: formData.status,
                isFavorite: formData.isFavorite,
                user_note: formData.notes,
                score: Number(formData.score) || 0,
                start_date: formData.startDate || null,
                finish_date: formData.finishDate || null,
                total_rewatch: Number(formData.rewatches) || 0,
                private: formData.private
            };
            try {
                yield userService.updateAnimeStatus(anime.id, updatePayload);
                onSave(updatePayload, true);
            }
            catch (error) {
                console.error("Failed to update anime status:", error);
            }
        }
        else {
            // Logic CREATE
            const apiPayload = {
                notify_email: true,
                episode_progress: Number(formData.progress) || 0,
                watch_status: formData.status,
                isFavorite: formData.isFavorite,
                start_date: formData.startDate || new Date().toISOString().split('T')[0],
                finish_date: formData.finishDate || null,
                total_rewatch: Number(formData.rewatches) || 0,
                user_note: formData.notes
            };
            onSave(apiPayload, false);
        }
    });
    const handleDeleteClick = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userService.deleteAnimeStatus(anime.id);
            if (onDelete) {
                onDelete(anime.id);
            }
            onClose();
        }
        catch (error) {
            console.error("Failed to delete anime:", error);
        }
    });
    return {
        formData,
        isEditMode,
        handleChange,
        toggleFavorite,
        handleSaveClick,
        handleDeleteClick
    };
};
//# sourceMappingURL=useEditorModal.js.map