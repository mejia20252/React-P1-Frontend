// src/api/api-mascota.ts
import axiosInstance from '../app/axiosInstance';
import type { MascotaRaw, MascotaCreateRequest } from '../types/type-mascota';

const API_BASE = '/mascotas/';

export const mascotaApi = {
  // ✅ getAllRaw: devuelve los datos crudos SIN expansión
  getAllRaw: async () => {
    const response = await axiosInstance.get<MascotaRaw[]>(API_BASE);
    return response.data;
  },

  getByIdRaw: async (id: number) => {
    const response = await axiosInstance.get<MascotaRaw>(`${API_BASE}${id}/`);
    return response.data;
  },

  create: async (data: MascotaCreateRequest) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('especie', data.especie);
    if (data.raza) formData.append('raza', data.raza);
    if (data.fecha_nacimiento) formData.append('fecha_nacimiento', data.fecha_nacimiento);
    formData.append('dueno', String(data.dueno));

    if (data.foto) {
      formData.append('foto', data.foto);
    }

    const response = await axiosInstance.post<MascotaRaw>(API_BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: MascotaCreateRequest) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('especie', data.especie);
    if (data.raza) formData.append('raza', data.raza);
    if (data.fecha_nacimiento) formData.append('fecha_nacimiento', data.fecha_nacimiento);
    formData.append('dueno', String(data.dueno));

    if (data.foto) {
      formData.append('foto', data.foto);
    }

    const response = await axiosInstance.patch<MascotaRaw>(`${API_BASE}${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`${API_BASE}${id}/`);
  },
};