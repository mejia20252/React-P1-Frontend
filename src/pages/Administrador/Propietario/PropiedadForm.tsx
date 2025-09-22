// components/administrador/propiedades/PropiedadForm.tsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PropiedadSchema, type PropiedadFormData } from '../../../schemas/schema-propiedad';
import { propiedadApi } from '../../../api/api-propiedad';
import { useNavigate, useParams } from 'react-router-dom';
import { toUiError } from '../../../api/error';

export default function PropiedadForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCasas, setLoadingCasas] = useState(true);
  const [loadingPropietarios, setLoadingPropietarios] = useState(true);
  const [casas, setCasas] = useState<Array<{ id: number; __str__: string }>>([]);
  const [propietarios, setPropietarios] = useState<Array<{ id: number; nombre: string; apellido_paterno: string }>>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [modoTransferencia, setModoTransferencia] = useState(false); // Para transferir si ya tiene propietario

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PropiedadFormData>({
    resolver: zodResolver(PropiedadSchema),
    defaultValues: {
      casa_id: 0,
      propietario_id: 0,
    },
  });

  // Cargar casas
  useEffect(() => {
    const cargarCasas = async () => {
      setLoadingCasas(true);
      try {
        const casasData = await propiedadApi.fetchCasasDisponibles();
        setCasas(casasData.map((c: any) => ({ id: c.id, __str__: c.__str__ || c.numero_casa })));
      } catch (err) {
        setError('No se pudieron cargar las casas.');
      } finally {
        setLoadingCasas(false);
      }
    };
    cargarCasas();
  }, []);

  // Cargar propietarios
  useEffect(() => {
    const cargarPropietarios = async () => {
      setLoadingPropietarios(true);
      try {
        const propietariosData = await propiedadApi.fetchPropietarios();
        setPropietarios(
          propietariosData.map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            apellido_paterno: p.apellido_paterno,
          }))
        );
      } catch (err) {
        setError('No se pudieron cargar los propietarios.');
      } finally {
        setLoadingPropietarios(false);
      }
    };
    cargarPropietarios();
  }, []);

  // Si estamos editando, cargar datos (aunque en propiedad no se edita, solo se asigna o transfiere)
  useEffect(() => {
    if (!id) return;

    const cargarPropiedad = async () => {
      try {
        const propiedad = await propiedadApi.getOne(id);
        setValue('casa_id', propiedad.casa.id);
        setValue('propietario_id', propiedad.propietario.id);
        if (!propiedad.activa) {
          setError('Esta propiedad ya no está activa. Solo puede transferirse desde una activa.');
          navigate('/administrador/asignar-propietario');
        }
      } catch (err: any) {
        setError('No se pudo cargar la propiedad.');
        navigate('/administrador/asignar-propietario');
      }
    };

    cargarPropiedad();
  }, [id, setValue, navigate]);

  const onSubmit = async (data: PropiedadFormData) => {
    setLoading(true);
    setError(null);

    try {
      let resultado;

      if (modoTransferencia) {
        // Transferir propiedad
        resultado = await propiedadApi.transferir({
          casa_id: data.casa_id,
          nuevo_propietario_id: data.propietario_id,
        });
      } else {
        // Asignar nueva propiedad
        resultado = await propiedadApi.create(data);
      }

      navigate('/administrador/asignar-propietario');
    } catch (err) {
      const { message, fields } = toUiError(err);
      setError(message);
      if (fields) setFormErrors(fields);

      // Si el error es "ya tiene propietario", activar modo transferencia
      if (message.includes('ya tiene un propietario activo')) {
        setModoTransferencia(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {modoTransferencia
            ? 'Transferir Propiedad'
            : id
              ? 'Editar Propiedad (No editable)'
              : 'Asignar Propietario a Casa'}
        </h1>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
            {modoTransferencia && (
              <p className="mt-2 text-xs">
                ¿Desea transferir la propiedad a este nuevo propietario?
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Casa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Casa *</label>
            {loadingCasas ? (
              <p className="text-sm text-gray-500">Cargando casas...</p>
            ) : (
              <select
                {...register('casa_id', { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.casa_id ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!!id} // Si es edición, no permitir cambiar casa
              >
                <option value="">-- Selecciona una casa --</option>
                {casas.map((casa) => (
                  <option key={casa.id} value={casa.id}>
                    {casa.__str__}
                  </option>
                ))}
              </select>
            )}
            {errors.casa_id && <p className="mt-1 text-xs text-red-500">{errors.casa_id.message}</p>}
            {formErrors.casa_id && (
              <p className="mt-1 text-xs text-red-500">{formErrors.casa_id.join(', ')}</p>
            )}
          </div>

          {/* Propietario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Propietario *</label>
            {loadingPropietarios ? (
              <p className="text-sm text-gray-500">Cargando propietarios...</p>
            ) : (
              <select
                {...register('propietario_id', { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.propietario_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Selecciona un propietario --</option>
                {propietarios.map((propietario) => (
                  <option key={propietario.id} value={propietario.id}>
                    {propietario.nombre} {propietario.apellido_paterno}
                  </option>
                ))}
              </select>
            )}
            {errors.propietario_id && (
              <p className="mt-1 text-xs text-red-500">{errors.propietario_id.message}</p>
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
              {loading
                ? 'Guardando...'
                : modoTransferencia
                  ? 'Transferir Propiedad'
                  : id
                    ? 'No editable'
                    : 'Asignar Propietario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}