// src/components/Staff/types.ts

export interface StaffMember {
  id?: number | string;
  name_full: string;
  role: string;
  image?: string;
}

export interface StaffSectionProps {
  animeId: number | string;
}

export interface StaffCardProps {
  staffMember: StaffMember;
}