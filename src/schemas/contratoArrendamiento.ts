// src/schemas/contratoArrendamiento.ts
import { z } from "zod";

export const contratoArrendamientoSchema = z.object({
  arrendatario: z.number({ message: "El arrendatario es obligatorio y debe ser un número." })
                 .min(1, "El arrendatario es obligatorio."),
  unidad: z.number({ message: "La unidad es obligatoria y debe ser un número." })
           .min(1, "La unidad es obligatoria."),
  propietario: z.number({ message: "El propietario es obligatorio y debe ser un número." })
                .min(1, "El propietario es obligatorio."),
  fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria")
                 .refine(val => !isNaN(new Date(val).getTime()), "Fecha de inicio inválida"),
  fecha_fin: z.string().nullable().optional()
              .refine(val => val ? !isNaN(new Date(val).getTime()) : true, "Fecha de fin inválida"),
  esta_activo: z.boolean().default(true),
});

export type ContratoArrendamientoFormState = z.infer<typeof contratoArrendamientoSchema>;

export interface ContratoArrendamiento {
  id: number;
  arrendatario: number;
  arrendatario_nombre: string;
  unidad: number;
  unidad_numero_casa: string;
  propietario: number;
  propietario_nombre: string;
  fecha_inicio: string; // ISO date string
  fecha_fin: string | null; // ISO date string or null
  esta_activo: boolean;
  estado_contrato: string;
}