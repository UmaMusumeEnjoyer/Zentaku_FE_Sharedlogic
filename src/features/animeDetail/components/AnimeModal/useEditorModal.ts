// src/components/EditorModal/useEditorModal.ts
import { useState, useEffect } from 'react';
import { userService } from '../../../../services/user.service';
import { Anime_Modal, UserStatusData_Modal, EditorFormData } from './AnimeModal.types';

export const useEditorModal = (
  anime: Anime_Modal,
  initialData: UserStatusData_Modal | null | undefined,
  onSave: (data: any, isUpdateMode: boolean) => void,
  onDelete: ((id: number | string) => void) | undefined,
  onClose: () => void
) => {
  const isEditMode = !!initialData && initialData.is_following;

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<EditorFormData>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement; // Type casting để truy cập checked
    const value = target.type === 'checkbox' ? target.checked : target.value;
    
    setFormData(prev => ({ 
      ...prev, 
      [target.name]: value 
    }));
  };

  const toggleFavorite = () => {
    setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleSaveClick = async () => {
    if (isEditMode) {
      // Logic UPDATE
      const updatePayload = {
        episode_progress: Number(formData.progress) || 0,
        watch_status: formData.status,
        isFavorite: formData.isFavorite,
        user_note: formData.notes
      };

      try {
        await userService.updateAnimeStatus(anime.id, updatePayload);
        onSave(updatePayload, true);
      } catch (error) {
        console.error("Failed to update anime status:", error);
        alert("Có lỗi xảy ra khi cập nhật!");
      }

    } else {
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
  };

  const handleDeleteClick = async () => {
    const title = anime.title?.romaji || anime.title?.english || 'anime này';
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${title}" khỏi danh sách?`)) {
      return;
    }

    try {
      await userService.deleteAnimeStatus(anime.id);
      if (onDelete) {
        onDelete(anime.id); 
      }
      onClose();
    } catch (error) {
      console.error("Failed to delete anime:", error);
      alert("Có lỗi xảy ra khi xóa anime!");
    }
  };

  return {
    formData,
    isEditMode,
    handleChange,
    toggleFavorite,
    handleSaveClick,
    handleDeleteClick
  };
};