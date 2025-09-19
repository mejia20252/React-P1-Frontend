// src/schemas/user.ts

import { z } from "zod";

// === Campos comunes obligatorios ===
const commonFields = {
  username: z.string().min(1, "El nombre de usuario es obligatorio").trim(),
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
  apellido_paterno: z.string().min(1, "El apellido paterno es obligatorio").trim(),
  apellido_materno: z.string().min(1, "El apellido materno es obligatorio").trim(),
  sexo: z.enum(["M", "F" ]).nullable().optional(), // Acepta M, F o null
  email: z.string().email("Email inválido").nullable().optional(),
  fecha_nacimiento: z.string().nullable().optional(), // Fecha en formato ISO (YYYY-MM-DD)
   direccion: z.string().nullable().optional(),
};

// === Lista de roles válidos (para validación dinámica) ===
const VALID_ROLES = ["Administrador", "Inquilino", "Propietario", "Personal", "Ninguno"] as const;
export type ValidRolName = typeof VALID_ROLES[number]; // "Administrador" | "Inquilino" | ...

// === Schema principal ===
export const userSchema = z.object({
  // Comunes
  ...commonFields,

  // Contraseña (obligatoria al crear, opcional al editar)
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
  confirm: z.string().optional(),

  // Rol (número para enviar al backend)
  rol: z.number().int().positive("Debe seleccionar un rol").nullable(), // ❌ Evita esto

  // Nombre del rol (usado solo para validación dinámica)
  rolNombre: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (val === "" || val === null) return false; // No permitir vacío o nulo
        return VALID_ROLES.includes(val as ValidRolName); // Validar que esté en la lista
      },
      {
        message: "Rol inválido o no seleccionado",
      }
    ),

  // Campos dinámicos por rol
  fecha_inicio_contrato: z.string().nullable().optional(),
  fecha_fin_contrato: z.string().nullable().optional(),
  fecha_adquisicion: z.string().nullable().optional(),
  tipo_personal: z.string().nullable().optional(),
  fecha_ingreso: z.string().nullable().optional(),
  salario: z.string().nullable().optional(),
    // 👇 NUEVOS CAMPOS PARA ADMINISTRADOR
  fecha_certificacion: z.string().nullable().optional(),
  empresa: z.string().nullable().optional(),
  numero_licencia: z.string().nullable().optional(),

})
.refine(
  (data) => {
    // Si no es edición, password es obligatorio
    if (!data.password) return false;
    return data.password.length >= 6;
  },
  {
    message: "La contraseña debe tener al menos 6 caracteres",
    path: ["password"],
  }
)
.refine(
  (data) => {
    // Si hay contraseña, debe coincidir con confirm
    if (data.password && data.confirm && data.password !== data.confirm) {
      return false;
    }
    return true;
  },
  {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  }
)
.refine(
  (data) => {
    // Inquilino: ambos campos obligatorios y fin >= inicio
    if (data.rolNombre === "Inquilino") {
      if (!data.fecha_inicio_contrato) return false;
      if (!data.fecha_fin_contrato) return false;
      if (data.fecha_inicio_contrato && data.fecha_fin_contrato) {
        const start = new Date(data.fecha_inicio_contrato);
        const end = new Date(data.fecha_fin_contrato);
        return end >= start;
      }
    }
    return true;
  },
  {
    message: "Para Inquilino, ambas fechas son obligatorias y la de fin no puede ser anterior a la de inicio.",
    path: ["fecha_fin_contrato"],
  }
)
.refine(
  (data) => {
    // Propietario: fecha_adquisicion obligatoria
    if (data.rolNombre === "Propietario" && !data.fecha_adquisicion) return false;
    return true;
  },
  {
    message: "Para Propietario, la fecha de adquisición es obligatoria.",
    path: ["fecha_adquisicion"],
  }
)
.refine(
  (data) => {
    // Administrador: numero_licencia obligatorio y no vacío
    if (data.rolNombre === "Administrador" && (!data.numero_licencia || !data.numero_licencia.trim())) return false;
    return true;
  },
  {
    message: "Para Administrador, el número de licencia es obligatorio.",
    path: ["numero_licencia"],
  }
)
.refine(
  (data) => {
    // Personal: tipo_personal, fecha_ingreso obligatorios; salario numérico si existe
    if (data.rolNombre === "Personal") {
      if (!data.tipo_personal) return false;
      if (!data.fecha_ingreso) return false;
      if (data.salario && isNaN(Number(data.salario))) return false;
    }
    return true;
  },
  {
    message: "Para Personal, el tipo, fecha de ingreso son obligatorios y el salario debe ser un número válido.",
    path: ["tipo_personal", "fecha_ingreso", "salario"],
  }
).// 👇 NUEVA VALIDACIÓN: Para Administrador, si se llena una fecha, debe ser válida
refine(
  (data) => {
    if (data.rolNombre === "Administrador" && data.fecha_certificacion) {
      const date = new Date(data.fecha_certificacion);
      return !isNaN(date.getTime()); // Valida que sea una fecha válida
    }
    return true;
  },
  {
    message: "La fecha de certificación debe ser una fecha válida.",
    path: ["fecha_certificacion"],
  }
)
// 👇 NUEVA VALIDACIÓN: Si se llena empresa, no puede estar vacía
.refine(
  (data) => {
    if (data.rolNombre === "Administrador" && data.empresa !== null && data.empresa !== undefined) {
      return data.empresa.trim().length > 0;
    }
    return true;
  },
  {
    message: "La empresa no puede estar vacía.",
    path: ["empresa"],
  }
);;

export type UserFormState = z.infer<typeof userSchema>;