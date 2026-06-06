export interface ListHeaderProps {
  listInfo: ListInfo;
  listId: string;
}

export interface ListInfo {
  list_name: string;
  description?: string;
  is_private: boolean;
  is_owner: boolean;
  color?: string;
  bannerImage?: string;
  communityId?: string;
  channelId?: string;
}

export interface LikerUser_listHeader {
  id: number | string;
  username: string;
  email_verified?: boolean;
}

export interface LikersResponse {
  likers: LikerUser_listHeader[];
  showing: number;
  like_count: number;
}