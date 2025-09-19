// src/types/type-residente.ts

export type RolResidencia = 'propietario' | 'familiar' | 'inquilino';

export interface Residente {
  id: number;
  usuario: number;     // ID del usuario asociado
  casa: number;        // ID de la casa asociada
  rol_residencia: RolResidencia;
  fecha_mudanza: string;  // ISO date: "YYYY-MM-DD"
}

export type ResidenteCreateRequest = Omit<Residente, 'id' | 'fecha_mudanza'>;

export type ResidenteResponse = Residente;