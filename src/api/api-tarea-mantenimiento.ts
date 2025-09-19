// src/api/api-tarea-mantenimiento.ts

import axiosInstance from '../app/axiosInstance';
import type { TareaMantenimiento, TareaMantenimientoCreateRequest } from '../types/type-tarea-mantenimiento';

const API_BASE = '/tareas-mantenimiento/';

export const tareaMantenimientoApi = {
  getAll: async () => {
    const response = await axiosInstance.get<TareaMantenimiento[]>(API_BASE);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<TareaMantenimiento>(`${API_BASE}${id}/`);
    return response.data;
  },

  create: async (data: TareaMantenimientoCreateRequest) => { // 👈 Aquí estaba el error: faltaba "data:"
    const response = await axiosInstance.post<TareaMantenimiento>(API_BASE, data);
    return response.data;
  },

  update: async (id: number, data: TareaMantenimientoCreateRequest) => { // 👈 Aquí también: faltaba "data:"
    const response = await axiosInstance.patch<TareaMantenimiento>(`${API_BASE}${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`${API_BASE}${id}/`);
  },
};