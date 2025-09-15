import { z } from 'zod';

export const VehiculoSchema = z.object({
  placa: z.string().min(1, "La placa es obligatoria"),
  tipo: z.string().min(1, "El tipo de vehículo es obligatorio"),
  dueno_id: z.number().int().positive("Debe seleccionar un dueño válido"), // 👈 Nuevo campo
});

export type VehiculoFormData = z.infer<typeof VehiculoSchema>;