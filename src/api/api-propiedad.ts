// api/api-propiedad.ts

import axiosInstance from '../app/axiosInstance';
import type { Propiedad, PropiedadFormData } from '../types/type-propiedad';

export const propiedadApi = {
  getAll: async (): Promise<Propiedad[]> => {
    const { data } = await axiosInstance.get<Propiedad[]>('/propiedades/');
    return data;
  },

  create: async (formData: PropiedadFormData): Promise<Propiedad> => {
    const { data } = await axiosInstance.post<Propiedad>('/propiedades/', formData);
    return data;
  },

  getOne: async (id: string): Promise<Propiedad> => {
    const { data } = await axiosInstance.get<Propiedad>(`/propiedades/${id}/`);
    return data;
  },

  // Transferir propiedad (endpoint personalizado)
  transferir: async (formData: {
    casa_id: number;
    nuevo_propietario_id: number;
  }): Promise<Propiedad> => {
    const { data } = await axiosInstance.post<Propiedad>('/propiedades/transferir/', formData);
    return data;
  },

  // 👇 FUNCIONES AUXILIARES MOVIDAS DENTRO DEL OBJETO
  fetchCasasDisponibles: async () => {
    const { data } = await axiosInstance.get('/casas/');
    return data.filter((casa: any) => casa.estado_ocupacion !== 'suspendida');
  },

  fetchPropietarios: async () => {
    const { data } = await axiosInstance.get('/usuarios/');
    console.log ('dat is ',data)
    return data.filter((usuario: any) => usuario.rol_nombre === 'Propietario');
    
  },
};