// src/api/api-pago.ts

import axiosInstance from '../app/axiosInstance';
import type { Pago, PagoCreateRequest } from '../types/type-pago';

const API_BASE = '/pagos/';

export const pagoApi = {
  getAll: async () => {
    const response = await axiosInstance.get<Pago[]>(API_BASE);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Pago>(`${API_BASE}${id}/`);
    return response.data;
  },

  create: async (data: PagoCreateRequest) => {
    const formData = new FormData();

    // Añadir campos simples
    if (data.cuota) formData.append('cuota', data.cuota.toString());
    if (data.reserva) formData.append('reserva', data.reserva.toString());
    formData.append('concepto', data.concepto.toString());
    formData.append('monto', data.monto);
    formData.append('metodo_pago', data.metodo_pago);
    if (data.referencia) formData.append('referencia', data.referencia);
    if (data.pagado_por) formData.append('pagado_por', data.pagado_por.toString());
    if (data.comprobante) formData.append('comprobante', data.comprobante);

    const response = await axiosInstance.post<Pago>(API_BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: PagoCreateRequest) => {
    const formData = new FormData();

    if (data.cuota) formData.append('cuota', data.cuota.toString());
    else formData.append('cuota', '');

    if (data.reserva) formData.append('reserva', data.reserva.toString());
    else formData.append('reserva', '');

    formData.append('concepto', data.concepto.toString());
    formData.append('monto', data.monto);
    formData.append('metodo_pago', data.metodo_pago);
    if (data.referencia) formData.append('referencia', data.referencia);
    else formData.append('referencia', '');

    if (data.pagado_por) formData.append('pagado_por', data.pagado_por.toString());
    else formData.append('pagado_por', '');

    if (data.comprobante) formData.append('comprobante', data.comprobante);

    const response = await axiosInstance.patch<Pago>(`${API_BASE}${id}/`, formData, {
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