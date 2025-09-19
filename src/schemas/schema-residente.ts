// src/schemas/schema-residente.ts
import { z } from "zod";

export const RolResidenciaSchema = z.enum(['propietario', 'familiar', 'inquilino']);
export type RolResidencia = z.infer<typeof RolResidenciaSchema>;

export const residenteSchema = z.object({
  id: z.number().int().positive(),
  usuario_id: z.number().int().positive("El ID del usuario debe ser un número positivo"),
  casa_id: z.number().int().positive("El ID de la casa debe ser un número positivo"),
  rol_residencia: RolResidenciaSchema,
  fecha_mudanza: z.string().date("La fecha de mudanza debe ser una fecha válida en formato YYYY-MM-DD"),
});

export const residenteCreateSchema = residenteSchema.omit({ id: true, fecha_mudanza: true });

export type ResidenteFormData = z.infer<typeof residenteCreateSchema>;