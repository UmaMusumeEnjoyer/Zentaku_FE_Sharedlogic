export enum TicketCategory {
  UI = 'UI',
  SERVER = 'SERVER',
  CONTENT = 'CONTENT',
  OTHER = 'OTHER',
}

export enum TicketStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface SupportTicket {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
    displayName?: string;
    avatar?: string;
  };
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category: TicketCategory;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}
