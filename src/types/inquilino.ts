// src/types/inquilino.ts
export interface Rol {
  id: number;
  nombre: string;
}
export interface Usuario {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
 sexo: string | null;
  username: string;
  email: string;
  password?: string;
  rol?: Rol;
}

export interface Inquilino {
  usuario: Usuario;
  fecha_inicio_contrato: string;
  fecha_fin_contrato: string;
}

// InquilinoDto now has the same nested structure as the form state
export interface InquilinoDto {
  usuario: {
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    sexo?: string; // Optional since it's not always required
    username: string;
    email: string;
    password?: string;
  };
  fecha_inicio_contrato: string;
  fecha_fin_contrato: string;
}