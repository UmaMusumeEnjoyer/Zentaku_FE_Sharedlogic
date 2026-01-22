// src/components/EditorModal/mediaModal.types.ts
import { ChangeEvent } from 'react';

export type MediaType = 'anime' | 'manga';

// Interface chung cho Item (Anime/Manga)
export interface MediaItem_Modal {
  id: number | string;
  cover_image: string;
  name_romaji: string;
  title?: { romaji?: string; english?: string };
}

// Dữ liệu trả về từ API (User Status)
export interface UserStatusData_Modal {
  // --- Anime specific ---
  watch_status?: string;
  episode_progress?: number;
  
  // --- Manga specific ---
  read_status?: string;     // Thường Manga dùng read_status thay vì watch_status
  chapter_progress?: number;
  volume_progress?: number;

  // --- Shared / Common ---
  status?: string; // Một số API trả về chung là status
  score?: number;
  start_date?: string;
  finish_date?: string;
  note?: string; // Hoặc user_note
  user_note?: string; 
  isFavorite?: boolean;
  total_rewatches_rereads?: number; // Hoặc total_rewatch
  total_rewatch?: number;
  private?: boolean;
  is_following?: boolean;
}

// State nội bộ của Form
export interface EditorFormData {
  status: string;
  score: number;
  progress: number;      // Dùng chung cho Episode (Anime) hoặc Chapter (Manga)
  volumes: number;       // Mới: Dành riêng cho Manga
  startDate: string;
  finishDate: string;
  rewatches: number;     // Dùng chung cho Rewatch/Reread
  notes: string;
  isFavorite: boolean;
  private: boolean;      // Thêm lại trường này để đồng bộ logic
}

export interface EditorModalProps {
  type: MediaType;       // Bắt buộc để xác định logic
  item: MediaItem_Modal; // Đổi tên từ anime -> item
  isOpen: boolean;
  initialData?: UserStatusData_Modal | null;
  onClose: () => void;
  onSave: (data: any, isUpdateMode: boolean) => void;
  onDelete?: (id: number | string) => void;
}

// Props cho các component con
export interface EditorModalHeaderProps {
  item: MediaItem_Modal; // Đổi tên prop từ anime -> item
  onClose: () => void;
  onSave: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

export interface EditorModalFormProps {
  type: MediaType;       // Cần type để render đúng label (Episode/Chapter)
  formData: EditorFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  isEditMode: boolean;
}

export interface EditorModalFooterProps {
  onDelete: () => void;
}