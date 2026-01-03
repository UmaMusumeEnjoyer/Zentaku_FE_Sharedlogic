// src/pages/StaffPage/useStaffPage.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { animeService } from '../../services/anime.service'; // Đảm bảo đường dẫn import đúng
import { Staff, RolesByYear, UseStaffPageReturn } from './staffPage.types';

// Helper function tách ra khỏi component
const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const useStaffPage = (staffId: string | undefined): UseStaffPageReturn => {
    const [staff, setStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [rolesByYear, setRolesByYear] = useState<RolesByYear>({});
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

    useEffect(() => {
        const fetchStaff = async () => {
            if (!staffId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await animeService.getStaffById(staffId);
                const data: Staff = response.data;
                setStaff(data);

                // Logic nhóm vai diễn theo năm
                const groupedRoles = data.media.reduce((acc: RolesByYear, role) => {
                    const year = role.season_year ? String(role.season_year) : 'TBA';
                    if (!acc[year]) {
                        acc[year] = [];
                    }
                    acc[year].push(role);
                    return acc;
                }, {});
                
                setRolesByYear(groupedRoles);

            } catch (error) {
                console.error("Failed to fetch staff data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [staffId]);

    // Sử dụng useMemo để tránh tính toán lại mỗi lần render nếu rolesByYear không đổi
    const sortedYears = useMemo(() => {
        return Object.keys(rolesByYear).sort((a, b) => {
            if (a === 'TBA') return -1; // Đưa TBA xuống cuối hoặc đầu tùy ý
            if (b === 'TBA') return 1;
            return Number(b) - Number(a); // Sắp xếp giảm dần
        });
    }, [rolesByYear]);

    // Logic tính toán xem có cần hiện nút Read More không
    const descriptionText = staff?.description || '';
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