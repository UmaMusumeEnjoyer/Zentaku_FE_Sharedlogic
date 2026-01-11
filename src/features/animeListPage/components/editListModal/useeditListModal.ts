import { useState, useEffect, useCallback } from 'react';
import { ListFormData } from './editListModal.types';
import { listService } from '../../../../services/list.service';

export const useEditListModal = (
  isOpen: boolean,
  initialData: ListFormData,
  listId: string,
  onUpdateSuccess: (data: ListFormData) => void,
  onClose: () => void
) => {
  const [formData, setFormData] = useState<ListFormData>({
    list_name: "",
    description: "",
    is_private: false,
    color: "#000000"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data khi modal mở
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        list_name: initialData.list_name || "",
        description: initialData.description || "",
        is_private: initialData.is_private || false,
        color: initialData.color || "#3db4f2"
      });
    }
  }, [isOpen, initialData]);

  // Handler: Input change
  const handleInputChange = useCallback((
    name: string, 
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handler: Submit form
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await listService.updateCustomList(listId, formData);
      onUpdateSuccess(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update list:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [listId, formData, onUpdateSuccess, onClose]);

  return {
    // State
    formData,
    isSubmitting,
    
    // Methods
    handleInputChange,
    handleSubmit,
  };
};