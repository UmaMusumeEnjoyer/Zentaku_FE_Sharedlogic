var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useRef } from 'react';
import { userService } from '../../../../services/user.service';
export const useEditProfileModal = (isOpen, currentUser, onUpdateSuccess, onClose) => {
    // --- STATE ---
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    // --- EFFECT: INIT FORM DATA ---
    // Logic: Chỉ reset form khi Modal MỞ ra (isOpen = true)
    // Giữ nguyên logic fix từ file gốc để tránh reset khi upload avatar xong
    useEffect(() => {
        if (isOpen && currentUser) {
            setFormData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                username: currentUser.username || ''
            });
            setError(null); // Reset error khi mở lại modal
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);
    // --- HANDLERS: FORM INPUT ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    // --- HANDLERS: AVATAR UPLOAD ---
    const handleUploadClick = () => {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    const handleFileChange = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        if (file.size > 2 * 1024 * 1024) {
            setError("Image size should be less than 2MB.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = yield userService.uploadAvatar(file);
            // Cập nhật UI cha ngay lập tức với avatar mới
            if (currentUser) {
                onUpdateSuccess(Object.assign(Object.assign({}, currentUser), { avatar_url: res.data.avatar_url }));
            }
        }
        catch (err) {
            console.error("Upload failed:", err);
            setError("Failed to upload avatar.");
        }
        finally {
            setLoading(false);
            if (e.target)
                e.target.value = ''; // Reset input file
        }
    });
    // --- HANDLERS: AVATAR DELETE ---
    const handleAvatarDelete = () => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            yield userService.deleteUserAvatar();
            if (currentUser) {
                onUpdateSuccess(Object.assign(Object.assign({}, currentUser), { avatar_url: undefined }));
            }
        }
        catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete avatar.");
        }
        finally {
            setLoading(false);
        }
    });
    // --- HANDLERS: SUBMIT ---
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = yield userService.updateUserProfile(formData);
            if (res.data) {
                onUpdateSuccess(res.data);
                onClose();
            }
        }
        catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update profile. Username might be taken.");
        }
        finally {
            setLoading(false);
        }
    });
    return {
        // Data
        formData,
        loading,
        error,
        fileInputRef,
        // Actions
        handleChange,
        handleUploadClick,
        handleFileChange,
        handleAvatarDelete,
        handleSubmit
    };
};
//# sourceMappingURL=useEditProfileModal.js.map