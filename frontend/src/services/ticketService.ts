import api from './api';
import { Ticket, TicketRequest, TicketStatus, Priority } from '../types';

export const ticketService = {
  getAllTickets: async (): Promise<Ticket[]> => {
    const response = await api.get('/tickets');
    return response.data;
  },

  getTicketById: async (id: number): Promise<Ticket> => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (data: TicketRequest): Promise<Ticket> => {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  updateTicket: async (id: number, data: TicketRequest): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },

  updateTicketStatus: async (id: number, status: TicketStatus): Promise<Ticket> => {
    const response = await api.patch(`/tickets/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  deleteTicket: async (id: number): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },

  searchTickets: async (
    search?: string,
    status?: TicketStatus,
    priority?: Priority
  ): Promise<Ticket[]> => {
    const response = await api.get('/tickets/search', {
      params: { search, status, priority },
    });
    return response.data;
  },

  getMyTickets: async (): Promise<Ticket[]> => {
    const response = await api.get('/tickets/my-tickets');
    return response.data;
  },

  getAssignedTickets: async (): Promise<Ticket[]> => {
    const response = await api.get('/tickets/assigned-to-me');
    return response.data;
  },
};
