export interface SidebarProps {
  members: ListMember_sidebar[];
  onAddEditor: () => void;
  onAddViewer: () => void;
  onRemoveMember: (username: string) => void;
}

export interface ListMember_sidebar {
  user_id?: number | string;
  username: string;
  is_owner?: boolean;
  permission_level?: 'owner' | 'edit' | 'view' | 'viewer';
  can_edit?: boolean;
  avatar?: string;
  avatar_url?: string;
}

export interface CategorizedMembers {
  owner: ListMember_sidebar | null;
  editors: ListMember_sidebar[];
  viewers: ListMember_sidebar[];
}

export interface UserItemProps {
  user: ListMember_sidebar;
  roleIcon?: string;
  iconTitle?: string;
  onRemove?: (username: string) => void;
  canRemove: boolean;
  isCurrentUser: boolean;
}