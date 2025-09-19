// src/schemas/schema-cuota.ts

import { z } from 'zod';

export const cuotaCreateSchema = z.object({
  concepto: z.number().int().positive("Concepto inválido"),
  casa: z.number().int().positive("Casa inválida"),
  monto: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido. Usa hasta 2 decimales, ej: 50.00")
    .min(1, "El monto debe ser mayor a 0"),
  periodo: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  fecha_vencimiento: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  estado: z.enum(['pendiente', 'pagada', 'vencida', 'cancelada']).optional(),
  fecha_pago: z.string().datetime({ offset: true }).nullable().optional(),
  generada_automaticamente: z.boolean().optional(),
});

export type CuotaFormData = z.infer<typeof cuotaCreateSchema>;