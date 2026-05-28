// Types cho EditListModal
export interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  initialData: ListFormData;
  onUpdateSuccess: (data: ListFormData) => void;
}

export interface ListFormData {
  list_name: string;
  description: string;
  is_private: boolean;
  color: string;
  bannerImage?: string;
  bannerImageFile?: File | null;
}