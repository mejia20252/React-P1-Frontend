// src/api/api-casa-v1.ts

import axiosInstance from '../app/axiosInstance';
import type { CasaV1 } from '../types/type-casa-v1';
import type { CasaFormDataV1 } from '../schemas/schema-casa-v1'; // ✅ Importa V1

export const casaApiV1 = {
  getAll: async (): Promise<CasaV1[]> => {
    const { data } = await axiosInstance.get<CasaV1[]>('/casas/'); // ✅ Asegúrate de que la URL sea correcta
    return data;
  },

  create: async (formData: CasaFormDataV1): Promise<CasaV1> => { // ✅ Usa CasaFormDataV1
    const { data } = await axiosInstance.post<CasaV1>('/casas/', formData);
    return data;
  },

  update: async (id: number, formData: Partial<CasaFormDataV1>): Promise<CasaV1> => { // ✅ Usa CasaFormDataV1
    const { data } = await axiosInstance.patch<CasaV1>(`/casas/${id}/`, formData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/casas/${id}/`);
  },

  fetchCasa: async (id: number): Promise<CasaV1> => {
    const { data } = await axiosInstance.get<CasaV1>(`/casas/${id}/`);
    return data;
  },

};