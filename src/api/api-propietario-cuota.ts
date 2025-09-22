import axiosInstance from '../app/axiosInstance';

import type{  CuotasResponse } from '../types/type-propietario-cuota';
import type{  Cuota } from '../types/type-propietario-cuota';

export const fetchMisCuotas = async (): Promise<CuotasResponse> => {
  const response = await axiosInstance.get<CuotasResponse>('/cuotas/mis-cuotas/');
  return response.data;
};
export const marcarCuotaComoPagada = async (cuotaId: number): Promise<Cuota> => {
  const response = await axiosInstance.post(`/cuotas/${cuotaId}/marcar-pagada/`);
  return response.data;
};