// Định nghĩa cấu trúc dữ liệu cho từng ngày trong heatmap
export interface ActivityDay {
  date: string;       // Format YYYY-MM-DD
  month: string;      // Tên tháng ngắn (Jan, Feb...)
  day: number;        // Ngày trong tháng
  isFuture: boolean;  // Cờ đánh dấu ngày tương lai (để ẩn đi)
}

// Định nghĩa props cho component
export interface ActivityHistoryProps {
  onTotalCountChange?: (total: number) => void;
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
}

// Định nghĩa kiểu dữ liệu cho object chứa số lượng activity (API response)
export interface HeatmapCounts {
  [date: string]: number;
}