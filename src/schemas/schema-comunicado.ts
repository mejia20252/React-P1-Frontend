import { z } from 'zod';

// Helper para transformar datetime-local a ISO string
const datetimeLocalToISO = z
  .string()
  .nullable()
  .optional()
  .transform((val) => {
    if (!val) return val;
    const date = new Date(val.endsWith('Z') || val.includes('+') || val.includes('-') ? val : val + 'Z');
    return isNaN(date.getTime()) ? null : date.toISOString();
  })
  .refine((val) => val !== null, {
    message: "Formato de fecha inválido. Use el selector de fecha.",
  })
  .pipe(z.string().datetime().nullable().optional());

// Definimos el esquema completo
export const comunicadoCreateSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio").max(200, "Máximo 200 caracteres"),
  contenido: z.string().min(1, "El contenido es obligatorio"),
  fecha_publicacion: datetimeLocalToISO,
  estado: z.enum(['borrador', 'publicado', 'archivado']).default('borrador'),
  // ✅ Aquí definimos casa_destino con transformación y validación
  casa_destino: z
    .any()
    .transform((val) => {
      if (val === "" || val == null) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
    .refine(
      (val) => val === null || (Number.isInteger(val) && val > 0),
      {
        message: "Debe ser un número entero positivo o nulo.",
      }
    )
    .nullable()
    .optional(),
  fecha_expiracion: datetimeLocalToISO,
});

// Validación adicional: Si estado es "publicado", fecha_publicacion debe existir
export const comunicadoCreateSchemaWithValidation = comunicadoCreateSchema.refine(
  (data) => {
    if (data.estado === 'publicado') {
      return data.fecha_publicacion != null;
    }
    return true;
  },
  {
    message: "Debe especificar una fecha de publicación si el estado es 'publicado'.",
    path: ["fecha_publicacion"],
  }
);

export type ComunicadoFormData = z.infer<typeof comunicadoCreateSchemaWithValidation>;