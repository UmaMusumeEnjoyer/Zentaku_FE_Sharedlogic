import { useState, useMemo, useCallback } from 'react';
export const useRequestList = (requests = [], currentMembers = []) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // Phân loại request theo type
    const categorizedRequests = useMemo(() => {
        const join = [];
        const edit = [];
        requests.forEach(req => {
            // Chỉ hiển thị request pending
            if (req.status !== 'pending')
                return;
            if (req.request_type === 'join') {
                join.push(req);
            }
            else if (req.request_type === 'edit_permission' || req.request_type === 'edit') {
                edit.push(req);
            }
        });
        return { joinRequests: join, editRequests: edit };
    }, [requests]);
    // Tổng số request
    const totalCount = useMemo(() => {
        return categorizedRequests.joinRequests.length + categorizedRequests.editRequests.length;
    }, [categorizedRequests]);
    // Kiểm tra điều kiện hiển thị nút Accept
    const checkShowAccept = useCallback((req) => {
        const existingMember = currentMembers.find(m => m.username === req.username);
        // LOGIC 1: Join Request
        // Nếu user đã là member (bất kỳ role nào) -> Ẩn Accept
        if (req.request_type === 'join') {
            if (existingMember)
                return false;
        }
        // LOGIC 2: Edit Request
        // Nếu user đã là owner hoặc editor -> Ẩn Accept
        if (req.request_type === 'edit_permission' || req.request_type === 'edit') {
            if (existingMember) {
                const isEditorOrOwner = existingMember.is_owner ||
                    existingMember.permission_level === 'edit' ||
                    existingMember.can_edit;
                if (isEditorOrOwner)
                    return false;
            }
        }
        return true;
    }, [currentMembers]);
    // Toggle expand/collapse
    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);
    // Format date
    const formatRequestDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString();
    }, []);
    return {
        // State
        isExpanded,
        categorizedRequests,
        totalCount,
        // Methods
        toggleExpanded,
        checkShowAccept,
        formatRequestDate,
    };
};
//# sourceMappingURL=userequestList.js.map