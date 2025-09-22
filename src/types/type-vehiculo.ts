// src/types/type-vehiculo.ts

export type VehiculoTipoStandard = 'automovil' | 'motocicleta' | 'camioneta' | 'otro';
export type VehiculoTipo = VehiculoTipoStandard | string;

export interface Vehiculo {
  id: number; // ID es siempre numérico y existe para vehículos ya creados
  placa: string;
  tipo: string;
  dueno: number; // ID del Usuario
  casa: number | null; // ID de la Casa, puede ser null
  dueno_nombre_completo?: string; // Solo para lectura
  casa_numero_casa?: string; // Solo para lectura
}

// Asegúrate de que este tipo se derive del schema si usas Zod
// Si no, asegúrate de que 'dueno' sea el campo en el formulario, no 'dueno_id'
export type VehiculoFormData = {
  placa: string;
  tipo: string;
  dueno: number; // Campo `dueno` en el payload, que es el ID del usuario
};