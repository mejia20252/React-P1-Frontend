// AsignacionTareasList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { toUiError } from '../../../api/error';
// Definición de tipos para AsignacionTarea
interface AsignacionTarea {
    id: number;
    tarea: number;
    tarea_titulo: string;
    tarea_estado: string;
    trabajador: number;
    trabajador_nombre_completo: string;
    trabajador_email: string;
    asignado_por: number | null;
    asignado_por_nombre_completo: string | null;
    asignado_por_email: string | null;
    fecha_asignacion: string; // ISO date string
    fecha_completado: string | null; // ISO date string or null
    estado_asignacion: 'activa' | 'completada' | 'cancelada' | 'reasignada';
    estado_asignacion_display: string;
    observaciones: string | null;
}
const AsignacionTareaList: React.FC = () => {
    const [asignaciones, setAsignaciones] = useState<AsignacionTarea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const fetchAsignacionesTarea = async (): Promise<AsignacionTarea[]> => {
        try {
            const response = await axiosInstance.get<AsignacionTarea[]>('/asignaciones-tarea/');
            return response.data;
        } catch (error) {
            console.error('Error al cargar asignaciones de tareas', error);
            const uiError = toUiError(error);
            toast.error(uiError.message || 'Error al cargar asignaciones de tareas.');
            return [];
        }
    };
    const loadAsignaciones = async () => {
        setLoading(true);
        const data = await fetchAsignacionesTarea();
        setAsignaciones(data);
        setLoading(false);
    };
    useEffect(() => {
        loadAsignaciones();
    }, []);
    const handleEdit = (id: number) => {
         navigate(`/administrador/asignacionestarea/${id}/editar`);
    };
    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta asignación de tarea?')) {
            return;
        }
        try {
            await axiosInstance.delete(`/asignaciones-tarea/${ id }/`);
            toast.success('Asignación de tarea eliminada exitosamente.');
            loadAsignaciones(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error('Error al eliminar asignación de tarea', error);
            const uiError = toUiError(error);
            toast.error(uiError.message || 'Error al eliminar la asignación de tarea.');
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'activa': return 'bg-blue-100 text-blue-800';
            case 'completada': return 'bg-green-100 text-green-800';
            case 'cancelada': return 'bg-red-100 text-red-800';
            case 'reasignada': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h2 className="text-3xl font-bold text-gray-800">Asignaciones de Tareas</h2>
                <button
                    onClick={() => navigate('/administrador/asignacionestarea/nuevo')}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Nueva Asignación
                </button>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500 text-lg">Cargando asignaciones...</p>
                </div>
            ) : asignaciones.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500 text-lg">No hay asignaciones de tareas para mostrar.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {asignaciones.map((asignacion) => (
                            <li key={asignacion.id} className="p-4 sm:p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex flex-col mb-2 sm:mb-0">
                                        <span className="text-xs font-semibold uppercase text-gray-500">ID: {asignacion.id}</span>
                                        <span className="text-xl font-semibold text-gray-900">Tarea: {asignacion.tarea_titulo || `Tarea #${asignacion.tarea}`}</span>
                                        <span className="text-sm text-gray-600">Trabajador: {asignacion.trabajador_nombre_completo} ({asignacion.trabajador_email})</span>
                                        {asignacion.asignado_por_nombre_completo && (
                                            <span className="text-sm text-gray-600">Asignado por: {asignacion.asignado_por_nombre_completo}</span>
                                        )}
                                        <span className="text-sm text-gray-600">Fecha Asignación: {new Date(asignacion.fecha_asignacion).toLocaleDateString()}</span>
                                        {asignacion.fecha_completado && (
                                            <span className="text-sm text-gray-600">Fecha Completado: {new Date(asignacion.fecha_completado).toLocaleDateString()}</span>
                                        )}
                                        <span className={`mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(asignacion.estado_asignacion)}`}>
                                            {asignacion.estado_asignacion_display}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(asignacion.id)}
                                            className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-300"
                                            aria-label={`Editar asignación de la tarea ${asignacion.tarea_titulo}`}
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="mr-2 hidden sm:block" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(asignacion.id)}
                                            className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-300"
                                            aria-label={`Eliminar asignación de la tarea ${asignacion.tarea_titulo}`}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} className="mr-2 hidden sm:block" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default AsignacionTareaList;
