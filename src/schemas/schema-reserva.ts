// src/schemas/schema-reserva.ts

import { z } from 'zod';

export const reservaCreateSchema = z.object({
  area_comun: z.number().int().positive("Selecciona un área común válida"),
  residente: z.number().int().positive("Selecciona un residente válido").or(z.literal(null)), // 👈 permite null
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  hora_inicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)"),
  hora_fin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)"),
  estado: z.enum(['pendiente', 'confirmada', 'cancelada']).optional(),
  pagada: z.boolean().optional(),
}).refine(
  (data) => {
    const start = new Date(`1970-01-01T${data.hora_inicio}:00`);
    const end = new Date(`1970-01-01T${data.hora_fin}:00`);
    return end > start;
  },
  {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["hora_fin"],
  }
);

export type ReservaFormData = z.infer<typeof reservaCreateSchema>;