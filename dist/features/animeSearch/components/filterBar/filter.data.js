// shared-logic/src/shared/utils/FilterData.ts
// Tạo danh sách Năm (từ năm hiện tại lùi về 2010)
const currentYear = new Date().getFullYear();
const yearsList = [];
for (let i = currentYear + 2; i >= 2010; i--) {
    yearsList.push(i);
}
// Genre keys (không thay đổi - dùng làm key cho API và i18n)
export const GENRE_KEYS = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Slice of Life",
    "Sci-Fi",
    "Horror",
    "Ecchi",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sports",
    "Supernatural",
    "Thriller"
];
// Mapping từ API value sang i18n key
export const GENRE_I18N_MAP = {
    "Action": "action",
    "Adventure": "adventure",
    "Comedy": "comedy",
    "Drama": "drama",
    "Fantasy": "fantasy",
    "Slice of Life": "sliceOfLife",
    "Sci-Fi": "sciFi",
    "Horror": "horror",
    "Ecchi": "ecchi",
    "Mahou Shoujo": "mahouShoujo",
    "Mecha": "mecha",
    "Music": "music",
    "Mystery": "mystery",
    "Psychological": "psychological",
    "Romance": "romance",
    "Sports": "sports",
    "Supernatural": "supernatural",
    "Thriller": "thriller"
};
// Season options với i18n keys
export const SEASON_OPTIONS = [
    { label: "winter", value: "WINTER" },
    { label: "spring", value: "SPRING" },
    { label: "summer", value: "SUMMER" },
    { label: "fall", value: "FALL" }
];
// Format options với i18n keys
export const FORMAT_OPTIONS = [
    { label: "tv", value: "TV" },
    { label: "tvShort", value: "TV_SHORT" },
    { label: "movie", value: "MOVIE" },
    { label: "special", value: "SPECIAL" },
    { label: "ova", value: "OVA" },
    { label: "ona", value: "ONA" },
    { label: "music", value: "MUSIC" }
];
// Status options với i18n keys
export const STATUS_OPTIONS = [
    { label: "releasing", value: "RELEASING" },
    { label: "finished", value: "FINISHED" },
    { label: "notYetReleased", value: "NOT_YET_RELEASED" },
    { label: "cancelled", value: "CANCELLED" },
    { label: "hiatus", value: "HIATUS" }
];
// Sort options với i18n keys
export const SORT_OPTIONS = [
    { label: "popularity", value: "POPULARITY_DESC" },
    { label: "title", value: "TITLE_ROMAJI" },
    { label: "score", value: "SCORE_DESC" },
    { label: "trending", value: "TRENDING_DESC" }
];
// Export filterData với structure cũ (backward compatible)
export const filterData = {
    years: yearsList,
    genres: GENRE_KEYS,
    seasons: SEASON_OPTIONS,
    formats: FORMAT_OPTIONS,
    statuses: STATUS_OPTIONS,
    sorts: SORT_OPTIONS
};
// Default values
export const DEFAULT_FILTER_VALUES = {
    keyword: '',
    genre: 'Any',
    year: 'Any',
    season: 'Any',
    format: 'Any',
    status: 'Any',
    sort: 'POPULARITY_DESC'
};
//# sourceMappingURL=filter.data.js.map