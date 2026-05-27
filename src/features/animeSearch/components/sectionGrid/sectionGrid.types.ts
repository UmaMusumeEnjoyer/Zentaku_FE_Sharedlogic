// Định nghĩa lỏng cho Anime object, bắt buộc phải có id và coverImage.
export interface AnimeItem_SectionGrid {
  id: number | string;
  [key: string]: any; // Cho phép các thuộc tính khác để truyền xuống AnimeCard
  coverImage: {
    large: string;
    [key: string]: any;
  };
}

export interface SectionGridProps {
  title: string;
  data: AnimeItem_SectionGrid[];
  loading?: boolean;
  onViewAll?: () => void; // Dấu ? thể hiện prop này không bắt buộc
}