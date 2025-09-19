// src/schemas/schema-area-comun.ts
import { z } from 'zod';

export const areaComunCreateSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  descripcion: z.string()
    .max(1000, "Máximo 1000 caracteres")
    .optional()
    .nullable()
    .transform(val => val || ''), // ← Siempre devuelve string
  costo_alquiler: z.string().regex(/^\d+(\.\d{1,2})?$/, "Formato inválido. Usa hasta 2 decimales, ej: 50.00"),
  capacidad: z.number().int().min(1, "Debe ser al menos 1 persona"),
  estado: z.enum(['disponible', 'mantenimiento', 'cerrada']),
});

// ✅ Este tipo ES el correcto: inferido directamente del schema
export type AreaComunFormData = z.infer<typeof areaComunCreateSchema>;