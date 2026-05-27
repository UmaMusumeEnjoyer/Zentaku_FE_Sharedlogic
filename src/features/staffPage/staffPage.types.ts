// src/pages/StaffPage/staffPage.types.ts

export interface StaffMediaRole {
    id: number | string;
    seasonYear: number | null;
    coverImage: { large: string };
    title: { romaji: string; english?: string; native?: string };
    format: string;
}

export interface Staff {
    id: number | string;
    image: { large: string };
    name: { full: string; native?: string };
    dateOfBirth?: { year?: number; month?: number; day?: number };
    age?: number | string;
    gender?: string;
    homeTown?: string;
    description?: string;
    staffMedia?: { nodes: StaffMediaRole[] };
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