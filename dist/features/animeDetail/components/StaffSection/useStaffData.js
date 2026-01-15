// src/components/Staff/useStaffData.ts
import { useMemo } from 'react';
// Input bây giờ là list dữ liệu đã có, không phải animeId nữa
export const useStaffData = (fullStaffList) => {
    // Logic xử lý dữ liệu: Chỉ giữ lại logic presentation (view logic)
    // Lấy tối đa 3 staff đầu tiên từ dữ liệu cha truyền xuống
    const staff = useMemo(() => {
        return fullStaffList.slice(0, 3);
    }, [fullStaffList]);
    // Không cần loading hay error riêng nữa vì cha đã quản lý
    return { staff };
};
//# sourceMappingURL=useStaffData.js.map