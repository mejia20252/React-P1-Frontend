// src/types/type-casa-v1.ts

export interface CasaV1 {
  id: number;
  numero_casa: string;
  tipo_de_unidad: string;
  numero: number;
  area: string; // ✅ Django DecimalField se serializa como string
  piso: number | null; // ✅ Puede ser null
  torre_o_bloque: string | null; // ✅ Puede ser null
  tiene_parqueo_asignado: boolean;
  numero_parqueo: string | null; // ✅ Puede ser null
  estado_ocupacion: 'ocupada' | 'desocupada' | 'en_mantenimiento' | 'suspendida';
  fecha_ultima_actualizacion: string; // ISO Date (ej: "2025-09-20T10:30:00Z")
  observaciones: string | null; // ✅ Puede ser null
}

// Interfaz para trabajar con area como number en el frontend
export interface CasaV1WithParsedArea extends Omit<CasaV1, 'area'> {
  area: number; // Para cálculos en el frontend
  area_raw: string; // Valor original del backend
}

// Helper para convertir area de string a number
export const parseCasaArea = (casa: CasaV1): CasaV1WithParsedArea => ({
  ...casa,
  area: parseFloat(casa.area),
  area_raw: casa.area,
});

// Helper para validar estado de ocupación
export const isValidEstadoOcupacion = (estado: string): estado is CasaV1['estado_ocupacion'] => {
  return ['ocupada', 'desocupada', 'en_mantenimiento', 'suspendida'].includes(estado);
};

// Tipos para formularios/creación
export interface CreateCasaPayload {
  numero_casa: string;
  tipo_de_unidad: string;
  numero: number;
  area: string; // Se envía como string al backend
  piso?: number | null;
  torre_o_bloque?: string | null;
  tiene_parqueo_asignado: boolean;
  numero_parqueo?: string | null;
  estado_ocupacion: CasaV1['estado_ocupacion'];
  observaciones?: string | null;
}

export interface UpdateCasaPayload extends Partial<CreateCasaPayload> {
  id: number;
}
export interface CasaFormData {
  numero_casa: string;
  tipo_de_unidad: string;
  numero: number;
  area: string;
  estado_ocupacion: 'ocupada' | 'desocupada' | 'en_mantenimiento' | 'suspendida';
  tiene_parqueo_asignado: boolean;
  piso?: number | null | undefined;
  torre_o_bloque?: string | null | undefined;
  numero_parqueo?: string | null | undefined;
  observaciones?: string | null | undefined;
}