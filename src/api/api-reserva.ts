// src/api/api-reserva.ts

import axiosInstance from '../app/axiosInstance';
import type { Reserva, ReservaCreateRequest } from '../types/type-reserva';

const API_BASE = '/reservas/';

export const reservaApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Reserva[]>(API_BASE);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Reserva>(`${API_BASE}${id}/`);
    return response.data;
  },

  create: async (data: ReservaCreateRequest) => {
    const response = await axiosInstance.post<Reserva>(API_BASE, data);
    return response.data;
  },

  update: async (id: number, data: ReservaCreateRequest) => {
    const response = await axiosInstance.patch<Reserva>(`${API_BASE}${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`${API_BASE}${id}/`);
  },
};