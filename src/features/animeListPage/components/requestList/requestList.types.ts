export interface RequestListProps {
  requests: ListRequest[];
  onAccept: (request: ListRequest) => void | Promise<void>;
  onReject: (request: ListRequest) => void | Promise<void>;
  currentMembers: ListMember[];
}

export interface ListRequest {
  request_id: number | string;
  username: string;
  request_type: 'join' | 'edit_permission' | 'edit';
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  requested_at: string;
}

export interface ListMember {
  username: string;
  is_owner?: boolean;
  permission_level?: 'owner' | 'edit' | 'view' | 'viewer';
  can_edit?: boolean;
}

export interface CategorizedRequests {
  joinRequests: ListRequest[];
  editRequests: ListRequest[];
}