import axiosInstance from '../app/axiosInstance'; // 👈 Import the custom instance
import type { CasaFormData } from '../schemas/schema-casa';
import type { Casa } from '../types/type-casa';

export const casaApi = {
  getAll: async (): Promise<Casa[]> => {
    const { data } = await axiosInstance.get<Casa[]>('/casas/');
    return data;
  },

  create: async (formData: CasaFormData): Promise<Casa> => {
    const { data } = await axiosInstance.post<Casa>('/casas/', formData);
    return data;
  },

  update: async (id: number, formData: Partial<CasaFormData>): Promise<Casa> => {
    const { data } = await axiosInstance.patch<Casa>(`/casas/${id}/`, formData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/casas/${id}/`);
  },
   // 👇 NUEVO: Obtener una sola casa por ID
  fetchCasa: async (id: number): Promise<Casa> => {
    const { data } = await axiosInstance.get<Casa>(`/casas/${id}/`);
    return data;
  }
};
