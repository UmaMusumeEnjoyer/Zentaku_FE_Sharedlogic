// Định nghĩa item cơ bản (có thể tái sử dụng từ các file trước)
export interface AnimeItem_HomePage {
  id: number | string;
  cover_image: string;
  [key: string]: any;
}

// Cấu trúc gom nhóm tất cả các list anime của User
export interface UserAnimeCollections {
  watching:  AnimeItem_HomePage[];      // In Progress
  completed:  AnimeItem_HomePage[];     // Completed
  onHold:  AnimeItem_HomePage[];        // Paused
  dropped:  AnimeItem_HomePage[];       // Dropped
  planning: AnimeItem_HomePage[];      // Plan to Watch
}

export interface HomePageloginProps {
  // Hiện tại chưa có props nào được truyền vào từ Router, để trống
}