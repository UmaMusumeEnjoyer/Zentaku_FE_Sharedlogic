var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/pages/StaffPage/useStaffPage.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { animeService } from '../../services/anime.service'; // Đảm bảo đường dẫn import đúng
// Helper function tách ra khỏi component
const formatDate = (dateString) => {
    if (!dateString)
        return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
export const useStaffPage = (staffId) => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rolesByYear, setRolesByYear] = useState({});
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    useEffect(() => {
        const fetchStaff = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!staffId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = yield animeService.getStaffById(staffId);
                const data = response.data;
                setStaff(data);
                // Logic nhóm vai diễn theo năm
                const groupedRoles = data.media.reduce((acc, role) => {
                    const year = role.season_year ? String(role.season_year) : 'TBA';
                    if (!acc[year]) {
                        acc[year] = [];
                    }
                    acc[year].push(role);
                    return acc;
                }, {});
                setRolesByYear(groupedRoles);
            }
            catch (error) {
                console.error("Failed to fetch staff data:", error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchStaff();
    }, [staffId]);
    // Sử dụng useMemo để tránh tính toán lại mỗi lần render nếu rolesByYear không đổi
    const sortedYears = useMemo(() => {
        return Object.keys(rolesByYear).sort((a, b) => {
            if (a === 'TBA')
                return -1; // Đưa TBA xuống cuối hoặc đầu tùy ý
            if (b === 'TBA')
                return 1;
            return Number(b) - Number(a); // Sắp xếp giảm dần
        });
    }, [rolesByYear]);
    // Logic tính toán xem có cần hiện nút Read More không
    const descriptionText = (staff === null || staff === void 0 ? void 0 : staff.description) || '';
    const CHARACTER_LIMIT = 400;
    const shouldShowReadMore = descriptionText.length > CHARACTER_LIMIT;
    const toggleDescription = useCallback(() => {
        setIsDescriptionExpanded(prev => !prev);
    }, []);
    return {
        staff,
        loading,
        rolesByYear,
        sortedYears,
        isDescriptionExpanded,
        toggleDescription,
        shouldShowReadMore,
        formatDate // Export helper function để UI sử dụng
    };
};
//# sourceMappingURL=useStaffPage.js.map