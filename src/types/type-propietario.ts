// --- Tipo base de Usuario ---
export interface UsuarioBase {
  id: number;
  username: string;
  email?: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  sexo: string;
  direccion: string;
  fecha_nacimiento: string;
  rol: { id: number; nombre: string };
}

// --- Campos de roles específicos ---
export interface InquilinoFields {
  fecha_inicio_contrato: string | null;
  fecha_fin_contrato: string | null;
}

export interface AdministradorFields {
  numero_licencia: string | null;
}

export interface PersonalFields {
  tipo_personal: string | null;
  fecha_ingreso: string | null;
  salario: number | null;
  fecha_certificacion: string | null;
  empresa: string | null;
}

// --- Usuario completo (para listados generales) ---
export type Usuario = UsuarioBase & InquilinoFields & AdministradorFields & PersonalFields;

// 👇 NUEVO: Usuario que es propietario (incluye fecha_adquisicion)
export interface PropietarioUsuario extends UsuarioBase {
  fecha_adquisicion: string | null; // ← Este campo viene del modelo Propietario
}