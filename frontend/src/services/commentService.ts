import api from './api';
import { Comment, CommentRequest } from '../types';

export const commentService = {
  getComments: async (ticketId: number): Promise<Comment[]> => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  addComment: async (ticketId: number, data: CommentRequest): Promise<Comment> => {
    const response = await api.post(`/tickets/${ticketId}/comments`, data);
    return response.data;
  },

  deleteComment: async (ticketId: number, commentId: number): Promise<void> => {
    await api.delete(`/tickets/${ticketId}/comments/${commentId}`);
  },
};
