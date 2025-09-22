
import axios from '../app/axiosInstance';
export interface Propiedad {
  id: number;
  casa: number; // ID de la casa
  casa_numero: string;
  casa_descripcion: string;
  propietario: number; // ID del usuario propietario
  propietario_nombre: string;
  propietario_email: string;
  fecha_adquisicion: string; // ISO Date string (ej: "2023-10-27")
  fecha_transferencia: string | null;
  activa: boolean;
}


export const fetchMisPropiedades = async (): Promise<Propiedad[]> => {
  const { data } = await axios.get<Propiedad[]>('/mis-propiedades/');
  return data;
};