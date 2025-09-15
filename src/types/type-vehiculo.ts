// src/types/type-vehiculo.ts

export type VehiculoTipoStandard = 'automovil' | 'motocicleta' | 'camioneta' | 'otro';
export type VehiculoTipo = VehiculoTipoStandard | string;

export interface Vehiculo {
  id: number;
  placa: string;
  tipo: VehiculoTipo;
  dueno: {
    id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno?: string;
    email?: string;
  };
  casa: {
    id: number;
    numero_casa: string;
    tipo_de_unidad: string;
  } | null;
}

// 👇 NUEVO: Tipo para el formulario (incluye dueno_id)
export type VehiculoFormData = {
  placa: string;
  tipo: string;
  dueno_id: number; // 👈 Nuevo campo: ID del dueño
};