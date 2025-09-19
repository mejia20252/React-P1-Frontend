// src/types/type-area-comun.ts

export type EstadoAreaComun = 'disponible' | 'mantenimiento' | 'cerrada';

export interface AreaComun {
  id: number;
  nombre: string;
  descripcion: string | null;
  costo_alquiler: string; // Backend devuelve string con formato decimal "50.00"
  capacidad: number;
  estado: EstadoAreaComun;
}

// Para crear/editar: omitimos id
export type AreaComunCreateRequest = Omit<AreaComun, 'id'>;
// ✅ NO definimos AreaComunFormData aquí — lo hace Zod en el schema