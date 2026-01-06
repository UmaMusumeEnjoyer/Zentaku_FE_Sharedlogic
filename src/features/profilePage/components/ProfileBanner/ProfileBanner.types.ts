// Định nghĩa các loại tab cụ thể để tránh dùng string tùy tiện
export type ProfileTabType = 'Overview' | 'Anime List' | 'Favorites' | 'Social' | string;

export interface ProfileBannerProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
}

// Cấu trúc dữ liệu cho một tab để render
export interface TabConfig {
  key: ProfileTabType;
  label: string;
  iconPath: string; // Chứa path d="" của SVG
}