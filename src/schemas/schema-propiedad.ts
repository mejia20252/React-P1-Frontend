// schemas/schema-propiedad.ts

import { z } from 'zod';

export const PropiedadSchema = z.object({
  casa_id: z.number().int().positive('Debe seleccionar una casa válida'),
  propietario_id: z.number().int().positive('Debe seleccionar un propietario válido'),
});

export type PropiedadFormData = z.infer<typeof PropiedadSchema>;