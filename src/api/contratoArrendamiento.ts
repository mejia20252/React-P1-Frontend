// src/api/contratoArrendamiento.ts
import axios from '../app/axiosInstance';
import type { ContratoArrendamiento, ContratoArrendamientoFormState } from '../schemas/contratoArrendamiento';

export const fetchContratosArrendamiento = async (): Promise<ContratoArrendamiento[]> => {
  const { data } = await axios.get<ContratoArrendamiento[]>('/contratos-arrendamiento/');
  return data;
};

export const fetchContratoArrendamiento = async (id: number): Promise<ContratoArrendamiento> => {
  const { data } = await axios.get<ContratoArrendamiento>(`/contratos-arrendamiento/${id}/`);
  return data;
};

export const createContratoArrendamiento = async (payload: ContratoArrendamientoFormState): Promise<ContratoArrendamiento> => {
  const { data } = await axios.post<ContratoArrendamiento>('/contratos-arrendamiento/', payload);
  return data;
};

export const updateContratoArrendamiento = async (id: number, payload: ContratoArrendamientoFormState): Promise<ContratoArrendamiento> => {
  const { data } = await axios.put<ContratoArrendamiento>(`/contratos-arrendamiento/${id}/`, payload);
  return data;
};

export const partialUpdateContratoArrendamiento = async (id: number, patch: Partial<ContratoArrendamientoFormState>): Promise<ContratoArrendamiento> => {
  const { data } = await axios.patch<ContratoArrendamiento>(`/contratos-arrendamiento/${id}/`, patch);
  return data;
};

export const deleteContratoArrendamiento = async (id: number): Promise<void> => {
  await axios.delete(`/contratos-arrendamiento/${id}/`);
};