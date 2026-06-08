import { apiClient } from '../api/apiClient';
import { CreateTicketRequest, SupportTicket, UpdateTicketStatusRequest } from '../features/support/support.types';

export const supportService = {
  createTicket: (data: CreateTicketRequest) => {
    return apiClient.post<{ success: boolean; data: SupportTicket }>('/support/tickets', data);
  },

  getAdminTickets: (params?: { page?: number; limit?: number; status?: string; category?: string }) => {
    return apiClient.get<{ data: SupportTicket[]; total: number }>('/support/admin/tickets', { params });
  },

  updateTicketStatus: (id: string, data: UpdateTicketStatusRequest) => {
    return apiClient.patch<{ success: boolean; data: SupportTicket }>(`/support/admin/tickets/${id}/status`, data);
  },
};
