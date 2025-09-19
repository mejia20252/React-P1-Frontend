import type { VehiculoAsignarCasaDTO, VehiculoDesasignarCasaDTO } from '../types/type-casa-assignment';
import axiosInstance from '../app/axiosInstance';
import type { Vehiculo } from '../types/type-vehiculo';

export const vehiculoApiAgigment = {
    // 👇 USANDO DTOs INDEPENDIENTES
    asignarCasa: async (vehiculoId: number, casaId: number): Promise<Vehiculo> => {
        const payload: VehiculoAsignarCasaDTO = { casa_id: casaId };
        const { data } = await axiosInstance.post<Vehiculo>(
            `/vehiculos/${vehiculoId}/asignar-casa/`,
            payload
        );
        return data;
    },

    desasignarCasa: async (vehiculoId: number): Promise<Vehiculo> => {
        const payload: VehiculoDesasignarCasaDTO = { casa_id: null };
        const { data } = await axiosInstance.post<Vehiculo>(
            `/vehiculos/${vehiculoId}/asignar-casa/`,
            payload
        );
        return data;



    },
}