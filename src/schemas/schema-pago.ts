// src/schemas/schema-pago.ts

import { z } from 'zod';

export const pagoCreateSchema = z.object({
  cuota: z.number().int().positive().nullable().optional(),
  reserva: z.number().int().positive().nullable().optional(),
  concepto: z.number().int().positive("Concepto es obligatorio"),
  monto: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido. Usa hasta 2 decimales, ej: 50.00")
    .min(1, "El monto debe ser mayor a 0"),
  metodo_pago: z.enum(['tarjeta', 'transferencia', 'efectivo', 'qr']),
  referencia: z.string().max(100, "Máximo 100 caracteres").nullable().optional(),
  pagado_por: z.number().int().positive().nullable().optional(),
  comprobante: z.instanceof(File).nullable().optional(),
}).refine(
  (data) => {
    return data.cuota != null || data.reserva != null;
  },
  {
    message: "Debe especificar al menos una cuota o una reserva.",
    path: ["cuota"],
  }
);
// ✅ Eliminado el .refine innecesario de metodo_pago

export type PagoFormData = z.infer<typeof pagoCreateSchema>;