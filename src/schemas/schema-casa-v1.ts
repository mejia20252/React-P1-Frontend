// src/schemas/schema-casa-v1.ts

import { z } from 'zod';

const estadoOcupacionSchema = z.enum(['ocupada', 'desocupada', 'en_mantenimiento', 'suspendida']);

export const CasaSchemaV1 = z.object({
  // ============ CAMPOS OBLIGATORIOS ============
  numero_casa: z.string().min(1, "El número de casa es obligatorio").max(10, "Máximo 10 caracteres"),
  tipo_de_unidad: z.string().min(1, "El tipo de unidad es obligatorio"),
  numero: z.number().int().positive("El número debe ser un entero positivo"),
  area: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "El área debe ser un número válido con hasta 2 decimales")
    .refine(val => parseFloat(val) > 0, "El área debe ser mayor que 0"),

  // ============ CAMPOS CON VALORES POR DEFECTO OBLIGATORIOS ============
  // ✅ Usa .default(...).or(...) para que el tipo inferido NO incluya undefined
  estado_ocupacion: estadoOcupacionSchema.default('desocupada').or(estadoOcupacionSchema),
  tiene_parqueo_asignado: z.boolean().default(false).or(z.boolean()),

  // ============ CAMPOS OPCIONALES ============
  piso: z.number().int().positive("El piso debe ser un entero positivo").nullable().optional(),
  torre_o_bloque: z.string().max(50, "Máximo 50 caracteres").nullable().optional(),
  numero_parqueo: z.string().max(20, "Máximo 20 caracteres").nullable().optional(),
  observaciones: z.string().nullable().optional(),
});

// Tipos derivados
export type CasaFormDataV1 = z.infer<typeof CasaSchemaV1>;

// Payload para backend (conversión de undefined → null)
export type CasaCreatePayload = Omit<CasaFormDataV1, 'propietario_nombre'> & {
  piso: number | null;
  torre_o_bloque: string | null;
  numero_parqueo: string | null;
  observaciones: string | null;
};

export const toBackendPayload = (formData: CasaFormDataV1): CasaCreatePayload => {
  const {
    piso,
    torre_o_bloque,
    numero_parqueo,
    observaciones,
    ...rest
  } = formData;

  return {
    ...rest,
    piso: piso == null || (typeof piso === 'number' && isNaN(piso)) ? null : piso,
    torre_o_bloque: torre_o_bloque === '' || torre_o_bloque === undefined ? null : torre_o_bloque,
    numero_parqueo: numero_parqueo === '' || numero_parqueo === undefined ? null : numero_parqueo,
    observaciones: observaciones === '' || observaciones === undefined ? null : observaciones,
  };
};