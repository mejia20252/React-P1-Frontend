// types/type-propiedad.ts

export interface Propiedad {
  id: number;
  casa: {
    id: number;
    numero_casa: string;
    tipo_de_unidad: string;
    torre_o_bloque?: string;
    __str__: string;
  };
  propietario: {
    id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    rol: {
      nombre: string;
    };
  };
  fecha_adquisicion: string; // YYYY-MM-DD
  fecha_transferencia: string | null;
  activa: boolean;
}

export interface PropiedadFormData {
  casa_id: number;
  propietario_id: number;
}