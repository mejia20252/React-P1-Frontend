// src/schemas/schema-mascota.ts
import { z } from 'zod';

export const mascotaCreateSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  especie: z.enum(['perro', 'gato', 'ave', 'otro']),
  raza: z.string().max(100, "Máximo 100 caracteres").nullable().optional(),
  fecha_nacimiento: z.string().nullable().optional(),
  dueno: z.number().int().positive("Debe seleccionar un propietario"),
});

export type MascotaFormData = z.infer<typeof mascotaCreateSchema>;