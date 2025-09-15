import axiosInstance from '../app/axiosInstance';
import type { VehiculoFormData } from '../schemas/schema-vehiculo';
import type { Vehiculo } from '../types/type-vehiculo';

export const vehiculoApi = {
  getAll: async (): Promise<Vehiculo[]> => {
    const { data } = await axiosInstance.get<Vehiculo[]>('/vehiculos/');
    return data;
  },

  create: async (formData: VehiculoFormData): Promise<Vehiculo> => {
    const { data } = await axiosInstance.post<Vehiculo>('/vehiculos/', formData);
    return data;
  },

  update: async (id: number, formData: VehiculoFormData): Promise<Vehiculo> => {
    const { data } = await axiosInstance.patch<Vehiculo>(`/vehiculos/${id}/`, formData);
    return data;
  },

  getOne: async (id: string): Promise<Vehiculo> => { // 👈 NUEVO MÉTODO
    const { data } = await axiosInstance.get<Vehiculo>(`/vehiculos/${id}/`);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/vehiculos/${id}/`);
  },
};