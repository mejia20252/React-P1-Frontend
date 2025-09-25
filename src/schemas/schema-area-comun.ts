import { z } from 'zod';

export const areaComunCreateSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  descripcion: z.string()
    .max(1000, "Máximo 1000 caracteres")
    .optional()
    .nullable()
    .transform(val => val || ''),
  es_de_pago: z.boolean().default(false), // ✅ Nuevo campo boolean
  costo_alquiler: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido. Usa hasta 2 decimales, ej: 50.00")
    .optional() // ✅ Make it optional at the base level
    .nullable() // Allow null
    .transform(val => val || '0.00'), // Ensure it's always a string number
  capacidad: z.number().int().min(1, "Debe ser al menos 1 persona"),
  estado: z.enum(['disponible', 'mantenimiento', 'cerrada']),
}).superRefine((data, ctx) => {
  // ✅ Validación condicional para costo_alquiler
  if (data.es_de_pago && (data.costo_alquiler === '0.00' || !data.costo_alquiler)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El costo de alquiler es obligatorio si el área es de pago.",
      path: ['costo_alquiler'],
    });
  }
  if (!data.es_de_pago && data.costo_alquiler !== '0.00') {
    // Optionally, if not de pago, ensure costo_alquiler is "0.00"
    // This is also handled in the form's onSubmit, but good for backend consistency.
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El costo de alquiler debe ser 0.00 si el área no es de pago.",
      path: ['costo_alquiler'],
    });
  }
});

export type AreaComunFormData = z.infer<typeof areaComunCreateSchema>;