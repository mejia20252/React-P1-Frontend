// src/api/api-residente.ts
import axiosInstance from '../app/axiosInstance';

import type { Residente, ResidenteCreateRequest } from '../types/type-residente';

export const residenteApi = {
  /**
   * Obtiene todos los residentes asignados a una casa específica
   */
  getAllByCasa: async (casaId: number): Promise<Residente[]> => {
    const { data } = await axiosInstance.get<Residente[]>(`/residentes/?casa_id=${casaId}`);
    return data;
  },

  /**
   * Crea un nuevo residente asignándolo a una casa
   */
  create: async (formData: ResidenteCreateRequest): Promise<Residente> => {
    const { data } = await axiosInstance.post<Residente>('/residentes/', formData);
    return data;
  },

  /**
   * Obtiene un residente específico por su ID
   */
  getOne: async (id: number): Promise<Residente> => {
    const { data } = await axiosInstance.get<Residente>(`/residentes/${id}/`);
    return data;
  },

  /**
   * Elimina un residente del sistema
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/residentes/${id}/`);
  },
  getAll: async (): Promise<Residente[]> => {
    const { data } = await axiosInstance.get<Residente[]>('/residentes/');
    return data;
  },
};