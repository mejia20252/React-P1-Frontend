// src/api/api-area-comun.ts
import axiosInstance from '../app/axiosInstance';
import type { AreaComun, AreaComunCreateRequest } from '../types/type-area-comun';

const API_BASE = '/areas-comunes/';

export const areaComunApi = {
  // Obtener todas las áreas comunes
  getAll: async (): Promise<AreaComun[]> => {
    const response = await axiosInstance.get<AreaComun[]>(API_BASE);
    return response.data;
  },

  // Obtener área común por ID
  getById: async (id: number): Promise<AreaComun> => {
    const response = await axiosInstance.get<AreaComun>(`${API_BASE}${id}/`);
    return response.data;
  },

  // Crear nueva área común
  create: async (data: AreaComunCreateRequest): Promise<AreaComun> => {
    const response = await axiosInstance.post<AreaComun>(API_BASE, data);
    return response.data;
  },

  // Actualizar área común
  update: async (id: number, data: Partial<AreaComunCreateRequest>): Promise<AreaComun> => {
    const response = await axiosInstance.put<AreaComun>(`${API_BASE}${id}/`, data);
    return response.data;
  },

  // Eliminar área común
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_BASE}${id}/`);
  },
};