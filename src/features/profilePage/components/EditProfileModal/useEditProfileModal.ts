import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { UserProfile, EditProfileFormData } from './EditProfileModal.types';
import { userService } from '../../../../services/user.service';

export const useEditProfileModal = (
  isOpen: boolean,
  currentUser: UserProfile | null,
  onUpdateSuccess: (user: UserProfile) => void,
  onClose: () => void
) => {
  // --- STATE ---
  const [formData, setFormData] = useState<EditProfileFormData>({
    first_name: '',
    last_name: '',
    username: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- HANDLERS: AVATAR UPLOAD ---
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await userService.uploadAvatar(file);

      // Cập nhật UI cha ngay lập tức với avatar mới
      if (currentUser) {
        onUpdateSuccess({
          ...currentUser,
          avatar_url: res.data.avatar_url
        });
      }

    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload avatar.");
    } finally {
      setLoading(false);
      if (e.target) e.target.value = ''; // Reset input file
    }
  };

  // --- HANDLERS: AVATAR DELETE ---
  const handleAvatarDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await userService.deleteUserAvatar();

      if (currentUser) {
        onUpdateSuccess({
          ...currentUser,
          avatar_url: undefined
        });
      }

    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete avatar.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS: SUBMIT ---
  // --- HANDLERS: SUBMIT ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await userService.updateUserProfile(formData);

      // ✅ FIX: API trả về { user: {...} } chứ không phải trực tiếp data
      const updatedUserData = 'user' in res.data ? res.data.user : res.data;

      if (updatedUserData) {
        // ✅ Cập nhật localStorage TRƯỚC KHI gọi callback
        if (updatedUserData.username) {
          localStorage.setItem('username', updatedUserData.username);
        }

        // ✅ Gọi callback với đầy đủ thông tin
        onUpdateSuccess(updatedUserData as UserProfile);

        // ✅ Đóng modal
        onClose();
      }
    } catch (err: any) {
      console.error("Update failed:", err);

      // Xử lý các loại lỗi cụ thể
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.username?.[0] ||
          err.response?.data?.message ||
          "Username might be taken or invalid.";
        setError(errorMsg);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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