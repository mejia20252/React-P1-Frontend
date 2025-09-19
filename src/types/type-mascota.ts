// src/types/type-mascota.ts

export type EspecieMascota = 'perro' | 'gato' | 'ave' | 'otro';

// ✅ Este es el tipo REAL que devuelve tu API
export interface MascotaRaw {
  id: number;
  nombre: string;
  especie: string; // puede ser "canino", lo normalizamos después
  raza: string | null;
  fecha_nacimiento: string | null;
  foto: string | null;
  dueno: number; // ID del residente
}

// ✅ Tipo crudo de Residente (lo que devuelve /residentes/)
export interface ResidenteRaw {
  id: number;
  usuario: number; // ¡SOLO ID! No es objeto
  casa: number;
  rol_residencia: string;
  fecha_mudanza: string; // ISO
}

// ✅ Tipo crudo de Usuario (lo que devuelve /usuarios/)
export interface UsuarioRaw {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string | null;
  rol: {
    id: number;
    nombre: string;
  };
}

// ✅ Para crear/editar
export type MascotaCreateRequest = Omit<MascotaRaw, 'id' | 'foto'> & {
  foto?: File | null;
};

// ✅ Normalización de especie (canino → perro)
export const normalizeEspecie = (especie: string): EspecieMascota => {
  const mapa: Record<string, EspecieMascota> = {
    perro: 'perro',
    canino: 'perro', // <-- Corrección clave
    gato: 'gato',
    ave: 'ave',
    otro: 'otro',
  };
  return mapa[especie] || 'otro';
};