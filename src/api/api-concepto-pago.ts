// src/api/api-concepto-pago.ts

import axiosInstance from '../app/axiosInstance';
import type { ConceptoPago, ConceptoPagoCreateRequest } from '../types/type-concepto-pago';

const API_BASE = '/conceptos-pago/';

export const conceptoPagoApi = {
  getAll: async () => {
    const response = await axiosInstance.get<ConceptoPago[]>(API_BASE);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<ConceptoPago>(`${API_BASE}${id}/`);
    return response.data;
  },

  create: async (data: ConceptoPagoCreateRequest) => {
    const response = await axiosInstance.post<ConceptoPago>(API_BASE, data);
    return response.data;
  },

  update: async (id: number, data: ConceptoPagoCreateRequest) => {
    const response = await axiosInstance.patch<ConceptoPago>(`${API_BASE}${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`${API_BASE}${id}/`);
  },
};