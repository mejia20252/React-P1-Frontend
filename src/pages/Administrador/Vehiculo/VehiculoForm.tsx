import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VehiculoSchema, type VehiculoFormData } from '../../../schemas/schema-vehiculo';
import { vehiculoApi } from '../../../api/api-vehiculo';
import { useNavigate, useParams } from 'react-router-dom'; // 👈 AÑADIDO useParams
import { toUiError } from '../../../api/error';
import { fetchUsuarios } from '../../../api/api-usuario';

// Tipos recomendados para sugerencias visuales
const TIPOS_RECOMENDADOS = [
    'automovil',
    'motocicleta',
    'camioneta',
    'otro'
] as const;

export default function VehiculoForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>(); // 👈 Obtiene el ID de la URL (si existe)
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);
    const [usuarios, setUsuarios] = useState<Array<{ id: number; nombre: string; apellido_paterno: string }>>([]);
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<VehiculoFormData>({
        resolver: zodResolver(VehiculoSchema),
        defaultValues: {
            placa: '',
            tipo: 'automovil',
            dueno_id: 0,
        },
    });

    // Cargar usuarios (dueños posibles)
    useEffect(() => {
        const cargarDueños = async () => {
            setLoadingUsuarios(true);
            try {
                const usuariosData = await fetchUsuarios();
                const dueñosValidos = usuariosData.filter(u =>
                    ['Propietario', 'Inquilino', 'Administrador'].includes(u.rol.nombre)
                );
                setUsuarios(
                    dueñosValidos.map(u => ({
                        id: u.id,
                        nombre: u.nombre,
                        apellido_paterno: u.apellido_paterno,
                    }))
                );
            } catch (err: any) {
                setError('No se pudieron cargar los dueños.');
            } finally {
                setLoadingUsuarios(false);
            }
        };

        cargarDueños();
    }, []);

    // Cargar vehículo si estamos en modo edición
    useEffect(() => {
        if (!id) return; // Si no hay ID, es creación → salir

        const cargarVehiculo = async () => {
            try {
                const vehiculo = await vehiculoApi.getOne(id); // 👈 ¡AÚN NO EXISTE! Lo creamos abajo
                setValue('placa', vehiculo.placa);
                setValue('tipo', vehiculo.tipo);
                setValue('dueno_id', vehiculo.dueno.id); // 👈 Asigna el ID del dueño
            } catch (err: any) {
                setError('No se pudo cargar el vehículo.');
                navigate('/administrador/vehiculos');
            }
        };

        cargarVehiculo();
    }, [id, setValue, navigate]);

    // ✅ NUEVO: Función para obtener un vehículo por ID
    // Añade esto a api-vehiculo.ts (más abajo te lo doy)

    const onSubmit = async (data: VehiculoFormData) => {
        setLoading(true);
        setError(null);

        try {
            if (id) {
                // Modo edición: usa PATCH
                await vehiculoApi.update(parseInt(id), data);
            } else {
                // Modo creación: usa POST
                await vehiculoApi.create(data);
            }

            navigate('/administrador/vehiculos');
        } catch (err) {
            const { message, fields } = toUiError(err);
            setError(message);
            if (fields) setFormErrors(fields);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {id ? 'Editar Vehículo' : 'Registrar Vehículo'}
                </h1>

                {error && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Placa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                        <input
                            {...register('placa')}
                            type="text"
                            placeholder="Ej: ABC-123"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.placa ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.placa && (
                            <p className="mt-1 text-xs text-red-500">{errors.placa.message}</p>
                        )}
                        {formErrors.placa && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.placa.join(', ')}</p>
                        )}
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo *</label>
                        <input
                            {...register('tipo')}
                            type="text"
                            placeholder="Ej: automóvil, moto, camioneta"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.tipo ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.tipo && (
                            <p className="mt-1 text-xs text-red-500">{errors.tipo.message}</p>
                        )}

                        {/* Sugerencias interactivas — Now using setValue! */}
                        <div className="mt-2 flex flex-wrap gap-1">
                            {TIPOS_RECOMENDADOS.map((tipo) => (
                                <button
                                    key={tipo}
                                    type="button"
                                    onClick={() => {
                                        setValue('tipo', tipo);
                                    }}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 cursor-pointer transition-colors"
                                >
                                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </button>
                            ))}
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            Puedes escribir libremente. Recomendamos: automovil, motocicleta, camioneta, otro.
                        </p>
                    </div>

                    {/* Dueño */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dueño del Vehículo *</label>
                        {loadingUsuarios ? (
                            <p className="text-sm text-gray-500">Cargando dueños...</p>
                        ) : (
                            <select
                                {...register('dueno_id', { valueAsNumber: true })}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.dueno_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">-- Selecciona un dueño --</option>
                                {usuarios.length > 0 ? (
                                    usuarios.map((usuario) => (
                                        <option key={usuario.id} value={usuario.id}>
                                            {usuario.nombre} {usuario.apellido_paterno}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No hay dueños disponibles</option>
                                )}
                            </select>
                        )}
                        {errors.dueno_id && (
                            <p className="mt-1 text-xs text-red-500">{errors.dueno_id.message}</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                            {loading ? 'Guardando...' : id ? 'Actualizar Vehículo' : 'Registrar Vehículo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}