// src/types/ContratoArrendamiento.d.ts

export interface ApiUsuario {
    id: number;
    username: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    rol: number; // ID del rol
    rol_nombre: string; // Nombre del rol para mostrar
}

export interface ApiCasa {
    id: number;
    numero_casa: string;
    tipo_de_unidad: string;
    torre_o_bloque: string | null;
    numero: number;
    estado_ocupacion: string;
}

export interface ApiContratoArrendamiento {
    id: number;
    arrendatario: number;
    arrendatario_nombre_completo: string; // Añadido para mostrar en lista
    arrendatario_email: string; // Añadido para mostrar en lista
    unidad: number;
    unidad_numero_casa: string; // Añadido para mostrar en lista
    unidad_torre_o_bloque: string | null; // Añadido para mostrar en lista
    propietario: number;
    propietario_nombre_completo: string; // Añadido para mostrar en lista
    propietario_email: string; // Añadido para mostrar en lista
    fecha_inicio: string; // Formato YYYY-MM-DD
    fecha_fin: string | null; // Formato YYYY-MM-DD o null
    esta_activo: boolean;
}