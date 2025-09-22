// schemas/schema-comunicado.ts
import { z } from 'zod';

// Helper para transformar datetime-local a ISO string
const datetimeLocalToISO = z
  .string()
  .nullable() // Permite que la cadena de entrada sea null
  .optional() // Permite que la cadena de entrada sea undefined
  .transform((val) => {
    // Si el valor es null, undefined o una cadena vacía, simplemente retornamos null.
    // Esto es lo que se pasará al pipe.
    if (!val) return null;

    // Intentamos parsear la fecha
    const date = new Date(val.endsWith('Z') || val.includes('+') || val.includes('-') ? val : val + 'Z');

    // Si la fecha es inválida, retornamos null
    if (isNaN(date.getTime())) return null;

    // Si es una fecha válida, la convertimos a ISO string
    return date.toISOString();
  })
  // El .pipe() aquí valida que la SALIDA del transform sea un string de fecha ISO 8601 o null.
  // Es importante que el tipo de entrada del esquema al que se hace pipe (z.string().datetime().nullable())
  // sea compatible con la salida del transform (string | null).
  .pipe(z.string().datetime().nullable()); // Nota: Eliminamos .optional() aquí porque .transform() ya maneja 'undefined' al inicio.
                                          // La salida de este schema será string | null.

// Definimos el esquema completo
export const comunicadoCreateSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio").max(200, "Máximo 200 caracteres"),
  contenido: z.string().min(1, "El contenido es obligatorio"),
  fecha_publicacion: datetimeLocalToISO, // Ahora esta puede ser null sin error de formato
  estado: z.enum(['borrador', 'publicado', 'archivado']).default('borrador'),
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
    return true; // Para otros estados (borrador, archivado), permitir fecha_publicacion nula
  },
  {
    message: "Debe especificar una fecha de publicación si el estado es 'publicado'.",
    path: ["fecha_publicacion"],
  }
);

export type ComunicadoFormData = z.infer<typeof comunicadoCreateSchemaWithValidation>;