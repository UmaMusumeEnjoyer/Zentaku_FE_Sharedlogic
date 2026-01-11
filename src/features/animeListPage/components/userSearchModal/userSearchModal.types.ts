export interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  roleType: 'editor' | 'viewer';
  onUserAdded: () => void;
  currentMembers: ListMember_userSearchModal[];
}

export interface ListMember_userSearchModal {
  username: string;
  is_owner?: boolean;
  can_edit?: boolean;
  permission_level?: 'owner' | 'edit' | 'view' | 'viewer';
  avatar?: string;
  avatar_url?: string;
}

export interface SearchUser {
  id?: number | string;
  username: string;
  email_verified?: boolean;
  avatar?: string;
  avatar_url?: string;
}

export interface UserSearchResultItemProps {
  user: SearchUser;
  currentMembers: ListMember_userSearchModal[];
  isEditorMode: boolean;
  isProcessing: boolean;
  onAddUser: (user: SearchUser) => void;
}

export interface ButtonState {
  text: string;
  icon: string;
  isDisabled: boolean;
  className: string;
}