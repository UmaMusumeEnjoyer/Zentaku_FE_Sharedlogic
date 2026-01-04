export interface AnimeItem_SectionGrid {
    id: number | undefined;
    [key: string]: any;
    cover_image: string;
}
export interface SectionGridProps {
    title: string;
    data: AnimeItem_SectionGrid[];
    onViewAll?: () => void;
}
//# sourceMappingURL=sectionGrid.types.d.ts.map