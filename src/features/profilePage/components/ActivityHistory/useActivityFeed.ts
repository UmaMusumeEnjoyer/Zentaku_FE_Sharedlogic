import { useState, useEffect, useMemo, useCallback } from 'react';
import { userService } from '../../../../services/user.service';
import { HeatmapCounts, ActivityDay } from './ActivityHistory.typs';

export const useActivityHistory = (username: string, onTotalCountChange?: (total: number) => void) => {
  const [heatmapCounts, setHeatmapCounts] = useState<HeatmapCounts>({});
  const [loading, setLoading] = useState(true);

  // --- LOGIC: GENERATE HEATMAP GRID ---
  // Sử dụng useMemo để không phải tính toán lại mảng này mỗi lần render nếu không cần thiết
  const yearWeeks = useMemo(() => {
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(endDate.getDate() - 364); 

    // Điều chỉnh để bắt đầu từ đúng thứ trong tuần
    const dayOfWeek = startDate.getDay(); 
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentDate = new Date(startDate);
    
    const weeks: ActivityDay[][] = [];
    for (let w = 0; w < 53; w++) {
        const week: ActivityDay[] = [];
        for (let d = 0; d < 7; d++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const displayDate = new Date(currentDate);
            const isFuture = displayDate > today;

            week.push({
                date: dateStr,
                month: displayDate.toLocaleString('default', { month: 'short' }),
                day: displayDate.getDate(),
                isFuture: isFuture
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
    }
    return weeks;
  }, []);

  // --- LOGIC: FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      
      if (!username) { 
        setLoading(false); 
        return; 
      }

      try {
        const res = await userService.getHeatmap(username);
        if (res.data && res.data.counts) {
          const counts = res.data.counts;
          setHeatmapCounts(counts);

          // Tính tổng activity trong 1 năm qua
          let total = 0;
          const today = new Date();
          const pastYear = new Date();
          pastYear.setDate(today.getDate() - 365);

          Object.keys(counts).forEach(dateStr => {
             const d = new Date(dateStr);
             if (d >= pastYear && d <= today) {
                total += counts[dateStr];
             }
          });
          
          // Gửi data lên cha
          if (onTotalCountChange) {
            onTotalCountChange(total);
          }
        }
      } catch (error) {
        console.error("Error fetching heatmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, onTotalCountChange]); // Giữ dependencies rỗng như file gốc để chỉ chạy 1 lần

  // --- LOGIC: HELPER CLASS ---
  const getLevelClass = useCallback((count: number) => {
    if (!count || count === 0) return 'level-0';
    if (count <= 2) return 'level-1';
    if (count <= 5) return 'level-2';
    if (count <= 9) return 'level-3';
    return 'level-4';
  }, []);

  return {
    heatmapCounts,
    loading,
    yearWeeks,
    getLevelClass
  };
};