// src/schemas/schema-tarea-mantenimiento.ts

import { z } from 'zod';

export const tareaMantenimientoCreateSchema = z.object({
  titulo: z.string().max(200, "Máximo 200 caracteres").nullable().optional(),
  descripcion: z.string().max(1000, "Máximo 1000 caracteres").nullable().optional(),
  casa: z.number().int().positive("Casa inválida").nullable().optional(),
  area_comun: z.number().int().positive("Área común inválida").nullable().optional(),
  ubicacion_personalizada: z.string().max(200, "Máximo 200 caracteres").optional(),
  prioridad: z.enum(['baja', 'media', 'alta', 'critica']).optional(),
  estado: z.enum(['creada', 'asignada', 'en_progreso', 'completada', 'cancelada']).optional(),
  costo_estimado: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido. Usa hasta 2 decimales, ej: 50.00")
    .nullable()
    .optional(),
}).refine(
  (data) => {
    // Al menos una ubicación debe estar presente
    const hasCasa = data.casa != null && data.casa > 0;
    const hasArea = data.area_comun != null && data.area_comun > 0;
    const hasUbicacion = (data.ubicacion_personalizada || '').trim().length > 0;

    return hasCasa || hasArea || hasUbicacion;
  },
  {
    message: "Debes especificar al menos una ubicación: casa, área común o ubicación personalizada.",
    path: ["casa"], // Señalamos el primer campo relevante
  }
).refine(
  (data) => {
    // Solo una ubicación debe estar presente
    const hasCasa = data.casa != null && data.casa > 0;
    const hasArea = data.area_comun != null && data.area_comun > 0;
    const hasUbicacion = (data.ubicacion_personalizada || '').trim().length > 0;

    const count = [hasCasa, hasArea, hasUbicacion].filter(Boolean).length;
    return count === 1;
  },
  {
    message: "Solo puedes especificar UNA ubicación: casa, área común o ubicación personalizada.",
    path: ["casa"],
  }
);

export type TareaMantenimientoFormData = z.infer<typeof tareaMantenimientoCreateSchema>;