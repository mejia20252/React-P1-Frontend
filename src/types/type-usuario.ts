// src/types/type-usuario.ts

export interface Usuario {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string; // Opcional
  email?: string;
  rol: {
    id: number;
    nombre: string; // Ej: "Propietario", "Inquilino", "Administrador"
  };
}
