// src/types/type-area-comun.ts
export interface AreaComun {
  id: number;
  nombre: string;
  descripcion: string | null; // Can be null from backend or '' from form transform
  es_de_pago: boolean; // ✅ Nuevo campo
  costo_alquiler: string; // Stored as Decimal in backend, string in frontend for validation
  capacidad: number;
  estado: 'disponible' | 'mantenimiento' | 'cerrada';
}

// Type for creating or updating an AreaComun
// This is inferred from your Zod schema and should match what the API expects
export type AreaComunCreateRequest = Omit<AreaComun, 'id'>;

// If you need a separate type for update that allows partial fields:
export type AreaComunUpdateRequest = Partial<AreaComunCreateRequest>;