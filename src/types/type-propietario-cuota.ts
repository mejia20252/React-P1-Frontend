// type-propietario-cuota.ts

/**
 * Define la estructura para un Rol de usuario.
 */
export interface Rol {
  id: number;
  nombre: string;
}

/**
 * Define la estructura simplificada para un Usuario,
 * especialmente cuando actúa como Propietario o Residente.
 */
export interface Usuario {
  id: number;
  username: string;
  email: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rol?: Rol; // Opcional, si siempre se carga el rol completo
  rol_nombre?: string; // Si el serializador solo devuelve el nombre del rol
}

/**
 * Define la estructura para el Concepto de Pago.
 */
export interface ConceptoPago {
  id: number;
  nombre: string;
  descripcion: string | null;
  es_fijo: boolean;
  monto_fijo: string | null; // Usar string para DecimalField
  activo: boolean;
}

/**
 * Define la estructura de una Casa, incluyendo la información de su propietario actual.
 */
export interface Casa {
  id: number;
  numero_casa: string;
  tipo_de_unidad: string;
  numero: number;
  area: string; // Usar string para DecimalField
  piso: number | null;
  torre_o_bloque: string | null;
  tiene_parqueo_asignado: boolean;
  numero_parqueo: string | null;
  estado_ocupacion: 'ocupada' | 'desocupada' | 'en_mantenimiento' | 'suspendida';
  fecha_ultima_actualizacion: string; // ISO 8601 string
  observaciones: string | null;
  propietario_actual?: { // Campo SerializerMethodField en CasaSerializer
    id: number;
    nombre: string;
    email: string | null;
    rol: string | null;
  } | null;
  tiene_propietario_activo?: boolean; // Campo SerializerMethodField en CasaSerializer
}

/**
 * Define la estructura para una Cuota, incluyendo los IDs de Concepto y Casa.
 */
export interface Cuota {
  id: number;
  concepto: number; // ID del ConceptoPago
  casa: number;     // ID de la Casa
  monto: string;    // Usar string para DecimalField
  periodo: string;  // ISO 8601 date string (YYYY-MM-DD)
  fecha_vencimiento: string; // ISO 8601 date string (YYYY-MM-DD)
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
  fecha_pago: string | null; // ISO 8601 datetime string o null
  generada_automaticamente: boolean;
  
  // Campos adicionales que podría añadir un serializador para "mis-cuotas"
  // para enriquecer la respuesta sin cargar todo el objeto
  concepto_nombre?: string; 
  casa_numero_casa?: string;
}

/**
 * Interfaz combinada para representar un Propietario con sus propiedades (Casas) y las Cuotas asociadas.
 * Esta interfaz es más conceptual y podría requerir múltiples llamadas a la API o un serializador personalizado
 * en Django que agrupe esta información.
 */
export interface PropietarioConCuotas {
  propietario: Usuario;
  casas: Array<{
    casa: Casa;
    cuotas: Cuota[]; // Cuotas específicas de esta casa
  }>;
  // Opcional: una lista plana de todas las cuotas del propietario
  todas_las_cuotas?: Cuota[]; 
}

/**
 * Interfaz para la respuesta del endpoint `/api/cuotas/mis-cuotas/`
 */
export interface MisCuotasResponse {
  id: number;
  monto: string;
  periodo: string;
  fecha_vencimiento: string;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
  fecha_pago: string | null;
  generada_automaticamente: boolean;
  concepto: number; // ID del ConceptoPago
  casa: number;     // ID de la Casa
  
  // Campos añadidos por el SerializerMethodField o to_representation si existen
  concepto_nombre?: string;
  casa_numero_casa?: string;
}

// Si quieres tipar la respuesta paginada (si usas paginación en DRF)
export interface CuotasResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: Cuota[];
}