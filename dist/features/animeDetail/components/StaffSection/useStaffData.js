var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/components/Staff/useStaffData.ts
import { useState, useEffect } from 'react';
import { animeService } from '../../../../services/anime.service';
export const useStaffData = (animeId) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchStaff = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!animeId)
                return;
            try {
                setLoading(true);
                const response = yield animeService.getAnimeStaff(animeId);
                // Logic xử lý dữ liệu: Lấy tối đa 3 staff đầu tiên
                // Đảm bảo response.data.staff khớp với kiểu StaffMember[]
                setStaff(response.data.staff.slice(0, 3));
            }
            catch (err) {
                console.error("Error fetching staff:", err);
                setError(err);
            }
            finally {
                setLoading(false);
            }
        });
        fetchStaff();
    }, [animeId]);
    return { staff, loading, error };
};
//# sourceMappingURL=useStaffData.js.map