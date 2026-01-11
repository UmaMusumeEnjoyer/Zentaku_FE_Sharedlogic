var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useCallback } from 'react';
import { listService } from '../../../../services/list.service';
export const useEditListModal = (isOpen, initialData, listId, onUpdateSuccess, onClose) => {
    const [formData, setFormData] = useState({
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
    const handleInputChange = useCallback((name, value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    }, []);
    // Handler: Submit form
    const handleSubmit = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        setIsSubmitting(true);
        try {
            yield listService.updateCustomList(listId, formData);
            onUpdateSuccess(formData);
            onClose();
        }
        catch (error) {
            console.error("Failed to update list:", error);
            throw error;
        }
        finally {
            setIsSubmitting(false);
        }
    }), [listId, formData, onUpdateSuccess, onClose]);
    return {
        // State
        formData,
        isSubmitting,
        // Methods
        handleInputChange,
        handleSubmit,
    };
};
//# sourceMappingURL=useeditListModal.js.map