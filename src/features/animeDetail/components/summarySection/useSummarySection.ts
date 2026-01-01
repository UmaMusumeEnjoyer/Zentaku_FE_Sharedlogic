import { useState, useEffect, useMemo } from 'react';
import { userService } from '../../../../services/user.service';
import { Anime, UserStatusData } from './summarySection.types';

const statusMap: Record<string, string> = {
  'watching': 'Watching',
  'plan_to_watch': 'Plan to Watch',
  'completed': 'Completed',
  'dropped': 'Dropped',
  'on_hold': 'On Hold'
};

export const useSummarySection = (anime: Anime) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatusData, setCurrentStatusData] = useState<UserStatusData | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // 1. Fetch dữ liệu khi anime thay đổi
  useEffect(() => {
    const fetchUserStatus = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken || !anime?.id) return;

      setIsLoadingStatus(true);
      try {
        const response = await userService.getAnimeStatus(anime.id);
        if (response && response.data) {
          setCurrentStatusData(response.data);
        }
      } catch (error) {
        setCurrentStatusData(null);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchUserStatus();
  }, [anime]);

  // 2. Logic tính toán trạng thái hiển thị của nút bấm
  const isFollowing = useMemo(() => {
    return currentStatusData && currentStatusData.is_following;
  }, [currentStatusData]);

  const buttonLabel = useMemo(() => {
    if (isLoadingStatus) return 'Loading...';
    if (isFollowing && currentStatusData) {
      return statusMap[currentStatusData.watch_status] || 'Unknown';
    }
    return 'Add to List';
  }, [isLoadingStatus, isFollowing, currentStatusData]);

  // 3. Các hàm xử lý sự kiện (Event Handlers)
  const handleBtnClick = () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (apiPayload: any, isUpdateMode = false) => {
    try {
      if (isUpdateMode) {
        // Update local state
        setCurrentStatusData(prev => ({
          ...prev,
          ...apiPayload
        } as UserStatusData));
      } else {
        // Call API Create
        await userService.updateAnimeStatus(anime.id, apiPayload);
        
        // Update local state: Set is_following = true
        setCurrentStatusData({
            ...apiPayload,
            anime: anime.id,
            is_following: true
        });
        alert("Thêm vào danh sách thành công!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = () => {
    setCurrentStatusData(null); 
    setIsModalOpen(false);
  };

  // Trả về tất cả những gì UI cần dùng
  return {
    isModalOpen,
    currentStatusData,
    buttonLabel,
    handleBtnClick,
    handleCloseModal,
    handleSave,
    handleDelete
  };
};