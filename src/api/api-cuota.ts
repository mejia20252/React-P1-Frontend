// src/api/api-cuota.ts

import axiosInstance from '../app/axiosInstance';
import type { Cuota, CuotaCreateRequest } from '../types/type-cuota';

const API_BASE = '/cuotas/';

export const cuotaApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Cuota[]>(API_BASE);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Cuota>(`${API_BASE}${id}/`);
    return response.data;
  },

  create: async (data: CuotaCreateRequest) => {
    const response = await axiosInstance.post<Cuota>(API_BASE, data);
    return response.data;
  },

  update: async (id: number, data: CuotaCreateRequest) => {
    const response = await axiosInstance.patch<Cuota>(`${API_BASE}${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`${API_BASE}${id}/`);
  },
};