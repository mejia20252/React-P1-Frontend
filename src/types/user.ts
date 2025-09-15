// src/types/user.ts

import type { Rol } from './index';

export interface CustomUserResponse {
  id: number;
  username: string;
  email: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: 'M' | 'F' | null;
  direccion: string | null;
  fecha_nacimiento: string | null;
  rol: Rol; 
  fecha_inicio_contrato?: string | null;
  fecha_fin_contrato?: string | null;
  fecha_adquisicion?: string | null;
  tipo_personal?: string | null;
  fecha_ingreso?: string | null;
  salario?: string | null;
  // 👇 NUEVOS CAMPOS PARA ADMINISTRADOR
  fecha_certificacion?: string | null;
  empresa?: string | null;
  numero_licencia?: string | null;

}

export interface CreateUserPayload {
  username: string;
  password: string;
  email?: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo?: 'M' | 'F' | null;
  direccion?: string | null;
  fecha_nacimiento?: string | null;
  //rol: number; // Sigue siendo ID (para enviar al backend)
  rol_nombre: string;
  // Campos dinámicos
  fecha_inicio_contrato?: string | null;
  fecha_fin_contrato?: string | null;
  fecha_adquisicion?: string | null;
  tipo_personal?: string | null;
  fecha_ingreso?: string | null;
  salario?: string | null;
  // 👇 NUEVOS CAMPOS PARA ADMINISTRADOR
  fecha_certificacion?: string | null;
  empresa?: string | null;
  numero_licencia?: string | null;

}

export interface UserFormState extends Omit<CreateUserPayload, 'password' | 'rol'> {
  confirm: string;
  rol: number | null;
}