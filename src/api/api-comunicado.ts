// src/api/api-comunicado.ts

import axiosInstance from '../app/axiosInstance';
import type { Comunicado, ComunicadoCreateRequest } from '../types/type-comunicado';

const API_BASE = '/comunicados/';

export const comunicadoApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Comunicado[]>(API_BASE);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Comunicado>(`${API_BASE}${id}/`);
    return response.data;
  },

  create: async (data: ComunicadoCreateRequest) => {
    const response = await axiosInstance.post<Comunicado>(API_BASE, data);
    return response.data;
  },

  update: async (id: number, data: ComunicadoCreateRequest) => {
    const response = await axiosInstance.patch<Comunicado>(`${API_BASE}${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`${API_BASE}${id}/`);
  },
};