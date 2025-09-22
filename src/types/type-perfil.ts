// src/types/user.ts

export interface Rol {
  id: number;
  nombre: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  sexo: string | null;
  direccion: string | null;
  fecha_nacimiento: string | null;
  rol: Rol;
  fecha_inicio_contrato: string | null;
  fecha_fin_contrato: string | null;
  fecha_adquisicion: string | null;
  numero_licencia: string | null;
  tipo_personal: string | null;
  fecha_ingreso: string | null;
  salario: number | null;
  fecha_certificacion: string | null;
  empresa: string | null;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rol: Rol;
  sexo?: string | null;
  direccion?: string | null;
  fecha_nacimiento?: string | null;
  tipo_personal?: string | null;
  fecha_ingreso?: string | null;
  salario?: number | null;
  fecha_certificacion?: string | null;
  empresa?: string | null;
}