export interface AnimeListPageParams {
  id: string;
}

export interface ListInfo {
  name: string;
  description: string;
  privacy: 'public' | 'private';
  color: string;
  isOwner: boolean;
}

export interface GroupedAnime {
  [username: string]: AnimeItemDetail[];
}

export interface AnimeItemDetail {
  id: string | number;
  anilist_id?:  string | number;
  _anilist_id?: string | number;
  _added_by?: string;
  _added_date?: string;
  _note?: string;
  name_romaji?: string;
  title_romaji?: string;
  title_english?: string;
  name_english?: string;
  cover_image: string;
  episodes?: number;
  average_score?: number;
  [key: string]: any;
}

export interface ListMember {
  userId?: number | string;
  username: string;
  isOwner?: boolean;
  permission?: 'owner' | 'editor' | 'viewer';
  avatar?: string;
}

export interface ListRequest {
  id: string | number;
  username: string;
  type: 'join' | 'edit';
  status: 'PENDING' | 'ACCEPT' | 'REJECT';
  message?: string;
  createdAt: string;
}

export type RequestType = 'join' | 'edit';
export type ModalRoleType = 'editor' | 'viewer';