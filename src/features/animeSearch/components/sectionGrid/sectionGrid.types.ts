// Định nghĩa lỏng cho Anime object vì ta chưa biết AnimeCard cần chính xác gì, 
// nhưng bắt buộc phải có id.
export interface AnimeItem_SectionGrid {
  id: number | undefined;
  [key: string]: any; // Cho phép các thuộc tính khác để truyền xuống AnimeCard
  cover_image: string;
}

export interface SectionGridProps {
  title: string;
  data: AnimeItem_SectionGrid[];
  onViewAll?: () => void; // Dấu ? thể hiện prop này không bắt buộc
}