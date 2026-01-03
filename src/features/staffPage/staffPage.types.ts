// src/pages/StaffPage/staffPage.types.ts

export interface StaffMediaRole {
    id: number | string;
    season_year: number | string | null;
    cover_image: string;
    title_romaji: string;
    format: string;
    character_role?: string;
}

export interface Staff {
    id: number | string;
    image: string;
    name_full: string;
    name_native: string;
    date_of_birth?: string;
    age?: number | string;
    gender?: string;
    home_town?: string;
    description?: string;
    media: StaffMediaRole[];
}

export interface RolesByYear {
    [key: string]: StaffMediaRole[];
}

export interface UseStaffPageReturn {
    staff: Staff | null;
    loading: boolean;
    rolesByYear: RolesByYear;
    sortedYears: string[];
    isDescriptionExpanded: boolean;
    toggleDescription: () => void;
    shouldShowReadMore: boolean;
    formatDate: (dateString?: string) => string;
}