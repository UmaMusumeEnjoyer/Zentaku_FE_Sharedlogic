var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/components/EditorModal/useMediaModal.ts
import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
export const useMediaModal = (type, item, initialData, onSave, onDelete, onClose) => {
    var _a;
    const isEditMode = (_a = initialData === null || initialData === void 0 ? void 0 : initialData.is_following) !== null && _a !== void 0 ? _a : false;
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
        volumes: 0,
        startDate: getTodayDate(),
        finishDate: '',
        rewatches: 0,
        notes: '',
        isFavorite: false,
        private: false
    });
    useEffect(() => {
        if (initialData) {
            // Mapping logic: ưu tiên lấy các trường dữ liệu tùy theo Type nếu API trả về khác nhau
            const currentStatus = initialData.watch_status || initialData.read_status || initialData.status || 'plan_to_watch';
            const currentProgress = type === 'anime'
                ? (initialData.episode_progress || 0)
                : (initialData.chapter_progress || 0);
            const currentRewatches = initialData.total_rewatch || initialData.total_rewatches_rereads || 0;
            setFormData({
                status: currentStatus,
                score: initialData.score || 0,
                progress: currentProgress,
                volumes: initialData.volume_progress || 0,
                startDate: initialData.start_date || getTodayDate(),
                finishDate: initialData.finish_date || '',
                rewatches: currentRewatches,
                notes: initialData.user_note || initialData.note || '',
                isFavorite: initialData.isFavorite || false,
                private: initialData.private || false
            });
        }
    }, [initialData, type]);
    const handleChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [target.name]: value })));
    };
    const toggleFavorite = () => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { isFavorite: !prev.isFavorite })));
    };
    const handleSaveClick = () => __awaiter(void 0, void 0, void 0, function* () {
        const commonPayload = {
            score: Number(formData.score) || 0,
            isFavorite: formData.isFavorite,
            user_note: formData.notes,
            start_date: formData.startDate || (isEditMode ? null : new Date().toISOString().split('T')[0]),
            finish_date: formData.finishDate || null,
            private: formData.private
        };
        try {
            if (type === 'anime') {
                const animePayload = Object.assign(Object.assign(Object.assign({}, commonPayload), { watch_status: formData.status, episode_progress: Number(formData.progress) || 0, total_rewatch: Number(formData.rewatches) || 0 }), (isEditMode ? {} : { notify_email: true }));
                yield userService.updateAnimeStatus(item.id, animePayload);
                onSave(animePayload, isEditMode);
            }
            else {
                // TODO: Implement Manga API endpoint when available
                console.warn("Manga API endpoints are not yet implemented.");
                /* const mangaPayload = {
                  ...commonPayload,
                  read_status: formData.status,
                  chapter_progress: Number(formData.progress) || 0,
                  volume_progress: Number(formData.volumes) || 0,
                  total_reread: Number(formData.rewatches) || 0,
                };
                await userService.updateMangaStatus(item.id, mangaPayload);
                onSave(mangaPayload, isEditMode);
                */
            }
        }
        catch (error) {
            console.error(`Failed to update ${type} status:`, error);
        }
    });
    const handleDeleteClick = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (type === 'anime') {
                yield userService.deleteAnimeStatus(item.id);
                if (onDelete)
                    onDelete(item.id);
                onClose();
            }
            else {
                // TODO: Implement Manga delete API
                console.warn("Manga Delete API is not yet implemented.");
                /*
                await userService.deleteMangaStatus(item.id);
                if (onDelete) onDelete(item.id);
                onClose();
                */
            }
        }
        catch (error) {
            console.error(`Failed to delete ${type}:`, error);
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
//# sourceMappingURL=useMediaModal.js.map