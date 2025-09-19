// src/schemas/schema-concepto-pago.ts

import { z } from 'zod';

// 1. Definimos el esquema de validación
const conceptoPagoCreateSchemaBase = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  descripcion: z.string().max(1000, "Máximo 1000 caracteres").nullable().optional(),
  es_fijo: z.boolean().optional(),
  monto_fijo: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido. Usa hasta 2 decimales, ej: 50.00")
    .nullable()
    .optional(),
  activo: z.boolean().optional(),
});

// 2. Agregamos refinamiento: si es_fijo=true → monto_fijo obligatorio
export const conceptoPagoCreateSchema = conceptoPagoCreateSchemaBase.refine(
  (data) => {
    if (data.es_fijo && (!data.monto_fijo || data.monto_fijo.trim() === '')) {
      return false;
    }
    return true;
  },
  {
    message: "Si el concepto es de monto fijo, debes especificar un monto.",
    path: ["monto_fijo"],
  }
);

// 3. Exportamos el tipo inferido
export type ConceptoPagoFormData = z.infer<typeof conceptoPagoCreateSchema>;