import type { Usuario } from '../types/type-usuario';
import type { PropietarioUsuario } from '../types/type-propietario';
import axiosInstance from '../app/axiosInstance';

// DTO para creación/actualización (si necesitas enviar datos)
export interface UsuarioDto {
  username?: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  email?: string;
  password?: string; // Solo para creación
}

// ————————————————————————————————
// OPERACIONES DE USUARIO
// ————————————————————————————————

/**
 * Obtiene la lista completa de usuarios.
 */
export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const { data } = await axiosInstance.get<Usuario[]>('/usuarios/');
  console.log(data,'mydata wa');
  
  return data;
};

/**
 * Obtiene un usuario específico por ID.
 */
export const fetchUsuario = async (id: number): Promise<Usuario> => {
  const { data } = await axiosInstance.get<Usuario>(`/usuarios/${id}/`);
  return data;
};

/**
 * Crea un nuevo usuario.
 * Solo útil si se necesita crear desde aquí (normalmente se crea vía rol).
 */
export const createUsuario = async (usuario: UsuarioDto): Promise<Usuario> => {
  const { data } = await axiosInstance.post<Usuario>('/usuarios/', usuario);
  return data;
};

/**
 * Actualiza completamente un usuario.
 */
export const updateUsuario = async (id: number, usuario: UsuarioDto): Promise<Usuario> => {
  const { data } = await axiosInstance.put<Usuario>(`/usuarios/${id}/`, usuario);
  return data;
};

/**
 * Actualiza parcialmente un usuario (PATCH).
 */
export const partialUpdateUsuario = async (
  id: number,
  patch: Partial<UsuarioDto>
): Promise<Usuario> => {
  const { data } = await axiosInstance.patch<Usuario>(`/usuarios/${id}/`, patch);
  return data;
};

/**
 * Elimina un usuario.
 */
export const deleteUsuario = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/usuarios/${id}/`);
};

export const getPropietarios = async (): Promise<PropietarioUsuario[]> => {
  const { data } = await axiosInstance.get<PropietarioUsuario[]>('/usuarios/propietarios/');
  return data;
};