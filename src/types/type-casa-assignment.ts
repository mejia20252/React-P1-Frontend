// src/types/type-casa-assignment.ts

export interface VehiculoAsignarCasaDTO {
  casa: number;
}

export interface VehiculoDesasignarCasaDTO {
  casa_id: null;
}

// Opcional: Unificar tipo para reusar en la API
export type VehiculoCasaAssignmentDTO = VehiculoAsignarCasaDTO | VehiculoDesasignarCasaDTO;