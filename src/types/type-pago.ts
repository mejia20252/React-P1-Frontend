// src/types/type-pago.ts

export type MetodoPago = 'tarjeta' | 'transferencia' | 'efectivo' | 'qr';

export interface Pago {
  id: number;
  cuota: number | null;
  reserva: number | null;
  concepto: number;
  monto: string;
  fecha_pago: string; // ISO string
  metodo_pago: MetodoPago;
  referencia: string | null;
  pagado_por: number | null;
  comprobante: string | null; // URL del archivo

  // Campos agregados por el serializador (to_representation)
  concepto_nombre?: string;
  metodo_pago_label?: string;
  pagado_por_email?: string;
  cuota_id?: number;
  reserva_id?: number;
}

export type PagoCreateRequest = {
  cuota?: number | null;
  reserva?: number | null;
  concepto: number;
  monto: string;
  metodo_pago: MetodoPago;
  referencia?: string | null;
  pagado_por?: number | null;
  comprobante?: File | null;
};