import api from './api';
import { User, Role } from '../types';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id: number, role: Role): Promise<User> => {
    const response = await api.patch(`/users/${id}/role`, null, {
      params: { role },
    });
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
