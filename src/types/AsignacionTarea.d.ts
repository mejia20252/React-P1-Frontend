export interface AsignacionTarea {
    id: number;
    tarea: number; // ID de la tarea
    tarea_titulo?: string;
    tarea_estado?: string;
    trabajador: number; // ID del perfil del trabajador
    trabajador_nombre_completo?: string;
    trabajador_email?: string;
    asignado_por?: number; // ID del usuario que asignó
    asignado_por_nombre_completo?: string;
    asignado_por_email?: string;
    fecha_asignacion: string; // ISO 8601 string
    fecha_completado?: string | null; // ISO 8601 string o null
    estado_asignacion: 'activa' | 'completada' | 'cancelada' | 'reasignada';
    estado_asignacion_display?: string; // Para mostrar el nombre amigable
    observaciones?: string | null;
}