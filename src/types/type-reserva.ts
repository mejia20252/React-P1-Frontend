// src/types/type-reserva.ts

// Estado de la reserva
export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada';

// Modelo de Reserva desde el backend (con IDs, no objetos)
export interface Reserva {
  id: number;
  area_comun: number; // 👈 solo ID
  residente: number | null; // 👈 solo ID, puede ser null
  fecha: string; // "YYYY-MM-DD"
  hora_inicio: string; // "HH:mm:ss"
  hora_fin: string; // "HH:mm:ss"
  estado: EstadoReserva;
  pagada: boolean;
}

// Para crear/editar
export type ReservaCreateRequest = {
  area_comun: number;
  residente: number | null; // 👈 puede ser null
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado?: EstadoReserva;
  pagada?: boolean;
};

// ✅ No definimos ReservaFormData aquí — lo hace Zod