import { FilterOption } from './filter.types';
export declare const GENRE_KEYS: readonly ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Slice of Life", "Sci-Fi", "Horror", "Ecchi", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sports", "Supernatural", "Thriller"];
export declare const GENRE_I18N_MAP: Record<string, string>;
export declare const SEASON_OPTIONS: FilterOption[];
export declare const FORMAT_OPTIONS: FilterOption[];
export declare const STATUS_OPTIONS: FilterOption[];
export declare const SORT_OPTIONS: FilterOption[];
export declare const filterData: {
    readonly years: number[];
    readonly genres: readonly ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Slice of Life", "Sci-Fi", "Horror", "Ecchi", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sports", "Supernatural", "Thriller"];
    readonly seasons: FilterOption[];
    readonly formats: FilterOption[];
    readonly statuses: FilterOption[];
    readonly sorts: FilterOption[];
};
export declare const DEFAULT_FILTER_VALUES: {
    readonly keyword: "";
    readonly genre: "Any";
    readonly year: "Any";
    readonly season: "Any";
    readonly format: "Any";
    readonly status: "Any";
    readonly sort: "POPULARITY_DESC";
};
//# sourceMappingURL=filter.data.d.ts.map