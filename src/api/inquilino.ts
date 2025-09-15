// src/api/inquilino.ts

import type {
  Inquilino,
  InquilinoDto
} from '../types/inquilino'; // Asegúrate de crear este archivo

import axios from '../app/axiosInstance';

export const fetchInquilinos = async (): Promise<Inquilino[]> => {
  const { data } = await axios.get<Inquilino[]>('/inquilinos/');
  return data;
};

export const fetchInquilino = async (id: number): Promise<Inquilino> => {
  const { data } = await axios.get<Inquilino>(`/inquilinos/${id}/`);
  return data;
};

export const createInquilino = async (r: InquilinoDto): Promise<Inquilino> => {
  const { data } = await axios.post<Inquilino>('/inquilinos/', r);
  return data;
};

export const updateInquilino = async (id: number, r: InquilinoDto): Promise<Inquilino> => {
  const { data } = await axios.put<Inquilino>(`/inquilinos/${id}/`, r);
  return data;
};

export const partialUpdateInquilino = async (id: number, patch: Partial<InquilinoDto>): Promise<Inquilino> => {
  const { data } = await axios.patch<Inquilino>(`/inquilinos/${id}/`, patch);
  return data;
};

export const deleteInquilino = async (id: number): Promise<void> => {
  await axios.delete(`/inquilinos/${id}/`);
};

