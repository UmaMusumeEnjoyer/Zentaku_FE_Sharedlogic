// src/components/EditorModal/useMediaModal.ts
import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import { 
  MediaItem_Modal, 
  UserStatusData_Modal, 
  EditorFormData, 
  MediaType 
} from './mediaModal.types';

export const useMediaModal = (
  type: MediaType,
  item: MediaItem_Modal,
  initialData: UserStatusData_Modal | null | undefined,
  onSave: (data: any, isUpdateMode: boolean) => void,
  onDelete: ((id: number | string) => void) | undefined,
  onClose: () => void
) => {
  const isEditMode = initialData?.is_following ?? false;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
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
        const animePayload = {
          ...commonPayload,
          watch_status: formData.status,
          episode_progress: Number(formData.progress) || 0,
          total_rewatch: Number(formData.rewatches) || 0,
          ...(isEditMode ? {} : { notify_email: true })
        };

        await userService.updateAnimeStatus(item.id, animePayload, isEditMode);
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

    } catch (error) {
      console.error(`Failed to update ${type} status:`, error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      if (type === 'anime') {
        await userService.deleteAnimeStatus(item.id);
        if (onDelete) onDelete(item.id);
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
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
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