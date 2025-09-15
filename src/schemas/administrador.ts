import { z } from 'zod';

// Esquema para el formulario de React Hook Form (tipos string para los inputs)
export const administradorFormSchema = z.object({
  // Campos del modelo Usuario
  nombre: z.string().min(1, 'El nombre es obligatorio.'),
  apellido_paterno: z.string().min(1, 'El apellido paterno es obligatorio.'),
  apellido_materno: z.string().min(1, 'El apellido materno es obligatorio.'),
  sexo: z.enum(['M', 'F']).nullable(),
  email: z.string().email('El correo electrónico no es válido.').min(1, 'El correo electrónico es obligatorio.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').max(128, 'Máximo 128 caracteres.'),
  direccion: z.string().nullable(),
  fecha_nacimiento: z.string().nullable(),
  rol: z.coerce.number().min(1, 'El ID de rol es obligatorio.'),
  // Campos del modelo Administrador
  numero_licencia: z.string().min(1, 'El número de licencia es obligatorio.'),
  fecha_certificacion: z.string().min(1, 'La fecha de certificación es obligatoria.'),
  empresa: z.string().nullable(),
  activo: z.boolean(),
});

export type AdministradorFormState = z.infer<typeof administradorFormSchema>;
export type AdministradorApiState = z.infer<typeof administradorApiSchema>;

export const administradorApiSchema = z.object({
  usuario: z.number().min(1, 'El ID de usuario es obligatorio.'),
  numero_licencia: z.string().min(1, 'El número de licencia es obligatorio.'),
  fecha_certificacion: z.string().min(1, 'La fecha de certificación es obligatoria.'),
  empresa: z.string().nullable(),
  activo: z.boolean(),
});