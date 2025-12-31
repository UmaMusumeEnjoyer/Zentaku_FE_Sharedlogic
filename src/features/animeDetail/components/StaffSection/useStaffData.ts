// src/components/Staff/useStaffData.ts
import { useState, useEffect } from 'react';
import { animeService } from '../../../../services/anime.service';
import { StaffMember } from './staffSection.types';

export const useStaffData = (animeId: number | string) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!animeId) return;
      try {
        setLoading(true);
        const response = await animeService.getAnimeStaff(animeId);
        // Logic xử lý dữ liệu: Lấy tối đa 3 staff đầu tiên
        // Đảm bảo response.data.staff khớp với kiểu StaffMember[]
        setStaff(response.data.staff.slice(0, 3));
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [animeId]);

  return { staff, loading, error };
};