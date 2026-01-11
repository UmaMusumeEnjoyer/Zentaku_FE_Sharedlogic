export interface AnimeItem_HomePage {
    id: number | string;
    cover_image: string;
    [key: string]: any;
}
export interface UserAnimeCollections {
    watching: AnimeItem_HomePage[];
    completed: AnimeItem_HomePage[];
    onHold: AnimeItem_HomePage[];
    dropped: AnimeItem_HomePage[];
    planning: AnimeItem_HomePage[];
}
export interface HomePageloginProps {
}
//# sourceMappingURL=HomePagelogin.types.d.ts.map