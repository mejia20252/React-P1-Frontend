// src/types/type-tarea-mantenimiento.ts

// Opciones de prioridad
export type PrioridadTarea = 'baja' | 'media' | 'alta' | 'critica';

// Opciones de estado
export type EstadoTarea = 'creada' | 'asignada' | 'en_progreso' | 'completada' | 'cancelada';

// Modelo desde el backend
export interface TareaMantenimiento {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  casa: number | null;           // ID de Casa
  area_comun: number | null;     // ID de AreaComun
  ubicacion_personalizada: string | null; // <-- Changed to allow null
  prioridad: PrioridadTarea;
  estado: EstadoTarea;
  fecha_creacion: string;        // ISO string
  costo_estimado: string | null; // Backend devuelve string decimal "50.00"
}

// Para crear/editar
export type TareaMantenimientoCreateRequest = {
  titulo?: string | null;          // <-- Added | null
  descripcion?: string | null;     // <-- Added | null
  casa?: number | null;
  area_comun?: number | null;
  ubicacion_personalizada?: string | null; // <-- Changed to allow null
  prioridad?: PrioridadTarea;
  estado?: EstadoTarea;
  costo_estimado?: string | null;  // <-- Added | null
};