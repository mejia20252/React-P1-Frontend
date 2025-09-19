// src/types/type-concepto-pago.ts

export interface ConceptoPago {
  id: number;
  nombre: string;
  descripcion: string | null;
  es_fijo: boolean;
  monto_fijo: string | null; // Backend devuelve string decimal "50.00"
  activo: boolean;
  // Campos agregados por el serializador (to_representation)
  es_fijo_label?: string;
  activo_label?: string;
}

export type ConceptoPagoCreateRequest = {
  nombre: string;
  descripcion?: string | null;
  es_fijo?: boolean;
  monto_fijo?: string | null; // En frontend lo manejamos como string para validación
  activo?: boolean;
};