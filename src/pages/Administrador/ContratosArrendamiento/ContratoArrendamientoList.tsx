import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { toUiError } from '../../../api/error';
import type { ApiContratoArrendamiento } from '../../../types/ContratoArrendamiento';

const ContratoArrendamientoList: React.FC = () => {
    const [contratos, setContratos] = useState<ApiContratoArrendamiento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchContratosArrendamiento = async (): Promise<ApiContratoArrendamiento[]> => {
        try {
            const response = await axiosInstance.get<ApiContratoArrendamiento[]>('/contratos-arrendamiento/');
            return response.data;
        } catch (error) {
            console.error('Error al cargar contratos de arrendamiento', error);
            const uiError = toUiError(error);
            toast.error(uiError.message || 'Error al cargar contratos de arrendamiento.');
            return [];
        }
    };

    const loadContratos = async () => {
        setLoading(true);
        const data = await fetchContratosArrendamiento();
        setContratos(data);
        setLoading(false);
    };

    useEffect(() => {
        loadContratos();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/administrador/contratos-arrendamiento/${id}/editar`);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este contrato de arrendamiento?')) {
            return;
        }
        try {
            await axiosInstance.delete(`/contratos-arrendamiento/${id}/`);
            toast.success('Contrato de arrendamiento eliminado exitosamente.');
            loadContratos(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error('Error al eliminar contrato de arrendamiento', error);
            const uiError = toUiError(error);
            toast.error(uiError.message || 'Error al eliminar el contrato de arrendamiento.');
        }
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h2 className="text-3xl font-bold text-gray-800">Contratos de Arrendamiento</h2>
                <button
                    onClick={() => navigate('/administrador/contratos-arrendamiento/nuevo')}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Nuevo Contrato
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500 text-lg">Cargando contratos...</p>
                </div>
            ) : contratos.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500 text-lg">No hay contratos de arrendamiento para mostrar.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {contratos.map((contrato) => (
                            <li key={contrato.id} className="p-4 sm:p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex flex-col mb-2 sm:mb-0">
                                        <span className="text-xs font-semibold uppercase text-gray-500">ID: {contrato.id}</span>
                                        <span className="text-xl font-semibold text-gray-900">
                                            Arrendatario: {contrato.arrendatario_nombre_completo}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Unidad: {contrato.unidad_torre_o_bloque ? `${contrato.unidad_torre_o_bloque} - ` : ''}Casa {contrato.unidad_numero_casa}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Propietario: {contrato.propietario_nombre_completo}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Inicio: {new Date(contrato.fecha_inicio).toLocaleDateString()}
                                            {contrato.fecha_fin && ` - Fin: ${new Date(contrato.fecha_fin).toLocaleDateString()}`}
                                        </span>
                                        <span className={`mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(contrato.esta_activo)}`}>
                                            {contrato.esta_activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(contrato.id)}
                                            className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-300"
                                            aria-label={`Editar contrato ${contrato.id}`}
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="mr-2 hidden sm:block" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contrato.id)}
                                            className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-300"
                                            aria-label={`Eliminar contrato ${contrato.id}`}
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

export default ContratoArrendamientoList;