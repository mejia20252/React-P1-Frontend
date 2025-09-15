// src/schemas/schema-casa.ts
import { z } from 'zod';

export const CasaSchema = z.object({
  numero_casa: z.string().min(1, "El número de casa es obligatorio"),
  tipo_de_unidad: z.string().min(1, "El tipo de unidad es obligatorio"),
  numero: z.number().positive("El número debe ser positivo"),
  area: z.number().positive("El área debe ser un número positivo"),
  propietario_nombre: z.string().optional(), // Campo opcional para asignar propietario
});

export type CasaFormData = z.infer<typeof CasaSchema>;