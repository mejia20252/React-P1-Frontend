// src/types/type-cuota.ts

export type EstadoCuota = 'pendiente' | 'pagada' | 'vencida' | 'cancelada';

export interface Cuota {
  id: number;
  concepto: number; // ID del ConceptoPago
  casa: number;     // ID de la Casa
  monto: string;    // Backend devuelve string decimal "50.00"
  periodo: string;  // ISO Date string (YYYY-MM-DD)
  fecha_vencimiento: string;
  estado: EstadoCuota;
  fecha_pago: string | null;
  generada_automaticamente: boolean;

  // Campos agregados por el serializador (to_representation)
  concepto_nombre?: string;
  casa_numero?: string;
  estado_label?: string;
}

export type CuotaCreateRequest = {
  concepto: number;
  casa: number;
  monto: string;
  periodo: string; // YYYY-MM-DD
  fecha_vencimiento: string;
  estado?: EstadoCuota;
  fecha_pago?: string | null;
  generada_automaticamente?: boolean;
};