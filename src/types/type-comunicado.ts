// src/types/type-comunicado.ts

export type EstadoComunicado = 'borrador' | 'publicado' | 'archivado';

export interface Comunicado {
  id: number;
  titulo: string;
  contenido: string;
  fecha_creacion: string; // ISO string
  fecha_publicacion: string | null;
  estado: EstadoComunicado;
  casa_destino: number | null; // ID de Casa
  archivo_adjunto: string | null; // URL del archivo
  fecha_expiracion: string | null;
}

export type ComunicadoCreateRequest = {
  titulo: string;
  contenido: string;
  fecha_publicacion?: string | null;
  estado?: EstadoComunicado;
  casa_destino?: number | null;
  archivo_adjunto?: File | null; // Solo en formularios
  fecha_expiracion?: string | null;
};