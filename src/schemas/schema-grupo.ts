import { z } from 'zod';

// Schema para el formulario de Grupo
export const groupSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del grupo es obligatorio')
    .max(150, 'El nombre no puede exceder 150 caracteres')
    .trim(),
  permissions: z.array(z.number()).nonempty('Debes seleccionar al menos un permiso'),
});

export type GroupFormState = z.infer<typeof groupSchema>;