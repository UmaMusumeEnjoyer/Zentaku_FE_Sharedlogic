export interface LikersModalProps {
  isOpen: boolean;
  onClose: () => void;
  likersData: LikerUser[];
  totalShowing: number;
  totalLikes: number;
}

export interface LikerUser {
  id: number | string;
  username: string;
  email_verified?: boolean;
}