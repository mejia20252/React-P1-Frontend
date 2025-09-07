/*
import { z } from "zod";

export const roleSchema = z.object({
  nombre: z
    .string()
    .trim() // recorta espacios y mantiene ZodString
    .min(1, "El nombre es obligatorio.")
    .max(10, "El nombre debe tener como máximo 10 caracteres."),
});

export type RoleForm = z.infer<typeof roleSchema>;
*/
// schemas/role.ts
import { z } from "zod";

export const roleSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(10, "Máximo 10 caracteres").trim(),
});

export type FormState = z.infer<typeof roleSchema>; // 👈 este será tu tipo del formulario
