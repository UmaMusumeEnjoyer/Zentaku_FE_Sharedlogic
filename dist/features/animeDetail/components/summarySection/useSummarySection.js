var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useMemo } from 'react';
import { userService } from '../../../../services/user.service';
const statusMap = {
    'watching': 'Watching',
    'plan_to_watch': 'Plan to Watch',
    'completed': 'Completed',
    'dropped': 'Dropped',
    'on_hold': 'On Hold'
};
export const useSummarySection = (anime) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStatusData, setCurrentStatusData] = useState(null);
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);
    // 1. Fetch dữ liệu khi anime thay đổi
    useEffect(() => {
        const fetchUserStatus = () => __awaiter(void 0, void 0, void 0, function* () {
            const authToken = localStorage.getItem('authToken');
            if (!authToken || !(anime === null || anime === void 0 ? void 0 : anime.id))
                return;
            setIsLoadingStatus(true);
            try {
                const response = yield userService.getAnimeStatus(anime.id);
                if (response && response.data) {
                    setCurrentStatusData(response.data);
                }
            }
            catch (error) {
                setCurrentStatusData(null);
            }
            finally {
                setIsLoadingStatus(false);
            }
        });
        fetchUserStatus();
    }, [anime]);
    // 2. Logic tính toán trạng thái hiển thị của nút bấm
    const isFollowing = useMemo(() => {
        return currentStatusData && currentStatusData.is_following;
    }, [currentStatusData]);
    const buttonLabel = useMemo(() => {
        if (isLoadingStatus)
            return 'Loading...';
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
    const handleSave = (apiPayload_1, ...args_1) => __awaiter(void 0, [apiPayload_1, ...args_1], void 0, function* (apiPayload, isUpdateMode = false) {
        try {
            if (isUpdateMode) {
                // Update local state
                setCurrentStatusData(prev => (Object.assign(Object.assign({}, prev), apiPayload)));
            }
            else {
                // Call API Create
                yield userService.updateAnimeStatus(anime.id, apiPayload);
                // Update local state: Set is_following = true
                setCurrentStatusData(Object.assign(Object.assign({}, apiPayload), { anime: anime.id, is_following: true }));
                alert("Thêm vào danh sách thành công!");
            }
            setIsModalOpen(false);
        }
        catch (error) {
            console.error("Lỗi khi lưu trạng thái:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    });
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
//# sourceMappingURL=useSummarySection.js.map