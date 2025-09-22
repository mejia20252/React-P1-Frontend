// src/api/telefonos.ts
import axiosInstance from '../app/axiosInstance';
import type { Telefono } from '../types/type-telefono';

/**
 * Recupera la lista completa de teléfonos.
 * @returns {Promise<Telefono[]>} Un arreglo de objetos Telefono.
 */
export const fetchTelefonos = async (): Promise<Telefono[]> => {
  const response = await axiosInstance.get<Telefono[]>('/telefonos/');
  return response.data;
};

/**
 * Recupera un teléfono específico por su ID.
 * @param {number} id El ID del teléfono a recuperar.
 * @returns {Promise<Telefono>} El objeto Telefono encontrado.
 */
export const fetchTelefono = async (id: number): Promise<Telefono> => {
  const response = await axiosInstance.get<Telefono>(`/telefonos/${id}/`);
  return response.data;
};

/**
 * Crea un nuevo teléfono.
 * @param {Omit<Telefono, 'id'>} telefono Los datos del nuevo teléfono.
 * @returns {Promise<Telefono>} El objeto Telefono creado.
 */
export const createTelefono = async (telefono: Omit<Telefono, 'id'>): Promise<Telefono> => {
  const response = await axiosInstance.post<Telefono>('/telefonos/', telefono);
  return response.data;
};

/**
 * Actualiza un teléfono existente por su ID.
 * @param {number} id El ID del teléfono a actualizar.
 * @param {Partial<Telefono>} telefono Los datos parciales del teléfono a actualizar.
 * @returns {Promise<Telefono>} El objeto Telefono actualizado.
 */
export const updateTelefono = async (id: number, telefono: Partial<Telefono>): Promise<Telefono> => {
  const response = await axiosInstance.patch<Telefono>(`/telefonos/${id}/`, telefono);
  return response.data;
};

/**
 * Elimina un teléfono por su ID.
 * @param {number} id El ID del teléfono a eliminar.
 * @returns {Promise<void>}
 */
export const deleteTelefono = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/telefonos/${id}/`);
};