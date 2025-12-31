export interface MediaItem {
    id: number;
    title_romaji: string;
    cover_image: string;
}
export interface CharacterData {
    id: number;
    name_full: string;
    name_native: string;
    image: string;
    description: string;
    media: MediaItem[];
}
export interface ExtraInfo {
    [key: string]: string;
}
//# sourceMappingURL=characterPage.types.d.ts.map