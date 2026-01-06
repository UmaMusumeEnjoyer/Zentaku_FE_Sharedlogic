export type ProfileTabType = 'Overview' | 'Anime List' | 'Favorites' | 'Social' | string;
export interface ProfileBannerProps {
    activeTab: ProfileTabType;
    onTabChange: (tab: ProfileTabType) => void;
}
export interface TabConfig {
    key: ProfileTabType;
    label: string;
    iconPath: string;
}
//# sourceMappingURL=ProfileBanner.types.d.ts.map