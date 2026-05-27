// src/components/GlobalSearch/types.ts

export interface SearchResultUser {
  id?: string | number;
  username: string;
  displayName?: string;
  avatar?: string;
  followersCount?: number;
  [key: string]: any;
}

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}