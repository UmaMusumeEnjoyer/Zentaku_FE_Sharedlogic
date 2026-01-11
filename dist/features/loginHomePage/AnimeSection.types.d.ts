export interface AnimeItem_AnimeSection {
    id: number | string;
    cover_image: string;
    [key: string]: any;
}
export interface NotificationSettings {
    notify_before_hours: number | string;
    enabled: boolean;
    notify_by_email: boolean;
    notify_in_app: boolean;
}
export interface AnimeSectionProps {
    title: string;
    animeList: AnimeItem_AnimeSection[];
    allowNotification?: boolean;
}
//# sourceMappingURL=AnimeSection.types.d.ts.map