import { ListFormData } from './editListModal.types';
export declare const useEditListModal: (isOpen: boolean, initialData: ListFormData, listId: string, onUpdateSuccess: (data: ListFormData) => void, onClose: () => void) => {
    formData: ListFormData;
    isSubmitting: boolean;
    handleInputChange: (name: string, value: string | boolean) => void;
    handleSubmit: () => Promise<void>;
};
//# sourceMappingURL=useeditListModal.d.ts.map