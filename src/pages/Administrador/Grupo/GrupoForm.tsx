import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { groupSchema, type GroupFormState } from '../../../schemas/schema-grupo';
import { toUiError } from '../../../api/error';

type ApiGroup = { id: number | string; name: string; permissions: number[] };
type ApiPermission = { id: number; name: string; codename: string; content_type: { app_label: string; model: string } };

const GrupoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');
  const [availablePermissions, setAvailablePermissions] = useState<ApiPermission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<GroupFormState>({
    defaultValues: { name: '', permissions: [] },
  });

   useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [groupData, permissionsData] = await Promise.all([
          isEdit && id
            ? axiosInstance.get<ApiGroup>(`/grupos/${id}/`)
            : Promise.resolve(null),
          axiosInstance.get<ApiPermission[]>('/auth-permisos/'),
        ]);

        const allPermissions = permissionsData.data.map(p => {
          const name = p.content_type
            ? `${p.content_type.app_label} | ${p.content_type.model} | ${p.name}`
            : p.name;
          return { ...p, name };
        });

        setAvailablePermissions(allPermissions);

        if (groupData?.data) {
          // Reset both name and permissions for react-hook-form
          reset({
            name: groupData.data.name,
            permissions: groupData.data.permissions, // <--- ADD THIS LINE
          });
          setSelectedPermissions(groupData.data.permissions);
        }
      } catch (err) {
        console.log('Error al cargar los datos:', err);
        setTopError('No se pudo cargar los datos necesarios. Verifica las rutas del API.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit, reset]); // Make sure `reset` is in the dependency array
  const onSubmit = async (values: GroupFormState) => {
    setTopError('');
    setFormErrors({});

    const result = groupSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setFormErrors(fieldErrors as Record<string, string[]>);
      return;
    }

    try {
      const dataToSave = {
        name: values.name,
        permissions: selectedPermissions,
      };

      if (isEdit && id) {
        await axiosInstance.patch(`/grupos/${id}/`, dataToSave);
      } else {
        await axiosInstance.post(`/grupos/`, dataToSave);
      }

      navigate('/administrador/grupos');
    } catch (error) {
      const uiError = toUiError(error);

      if (uiError.fields) {
        setFormErrors(uiError.fields);
      } else if (uiError.message) {
        setTopError(uiError.message);
      } else {
        setTopError('Ocurrió un error inesperado al guardar el grupo.');
      }
    }
  };

  const handleMoveToChosen = (permId: number) => {
    const newPermissions = [...new Set([...selectedPermissions, permId])];
    setSelectedPermissions(newPermissions);
    setValue('permissions', newPermissions);
  };

  const handleMoveToAvailable = (permId: number) => {
    const newPermissions = selectedPermissions.filter(p => p !== permId);
    setSelectedPermissions(newPermissions);
    setValue('permissions', newPermissions);
  };

  const handleMoveAllToChosen = () => {
    const allIds = availablePermissions.map(p => p.id);
    setSelectedPermissions(allIds);
    setValue('permissions', allIds);
  };

  const handleMoveAllToAvailable = () => {
    setSelectedPermissions([]);
    setValue('permissions', []);
  };

  const chosenPerms = useMemo(() => {
    return availablePermissions.filter(p => selectedPermissions.includes(p.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [availablePermissions, selectedPermissions]);

  const availablePerms = useMemo(() => {
    return availablePermissions.filter(p => !selectedPermissions.includes(p.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [availablePermissions, selectedPermissions]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Grupo' : 'Nuevo Grupo'}</h2>
          <button
            onClick={() => navigate('/administrador/grupos')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Volver a la lista de grupos"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {topError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
            {topError}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <p className="text-gray-600">Cargando datos…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder="Ej. Gerentes"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.name?.map((m, i) => (
                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permisos</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 border border-gray-300 rounded-md p-2 h-72 flex flex-col">
                  <h3 className="text-sm font-semibold mb-2">Permisos disponibles</h3>
                  <select
                    multiple
                    size={10}
                    className="w-full h-full border-0 focus:ring-0"
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value, 10));
                      selected.forEach(handleMoveToChosen);
                    }}
                  >
                    {availablePerms.map(perm => (
                      <option key={perm.id} value={perm.id}>{perm.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-1 flex flex-row md:flex-col justify-center items-center space-x-2 md:space-x-0 md:space-y-2">
                  <button
                    type="button"
                    onClick={handleMoveAllToChosen}
                    className="text-blue-600 hover:text-blue-800 transition-colors px-2 py-2 rounded border border-blue-100 mb-2 w-full flex items-center justify-center"
                    aria-label="Añadir todos los permisos"
                    title="Añadir todos los permisos"
                  >
                    &gt;&gt;
                  </button>
                  <button
                    type="button"
                    onClick={handleMoveAllToAvailable}
                    className="text-blue-600 hover:text-blue-800 transition-colors px-2 py-2 rounded border border-blue-100 w-full flex items-center justify-center"
                    aria-label="Remover todos los permisos"
                    title="Remover todos los permisos"
                  >
                    &lt;&lt;
                  </button>
                </div>

                <div className="col-span-1 border border-gray-300 rounded-md p-2 h-72 flex flex-col">
                  <h3 className="text-sm font-semibold mb-2">Permisos asignados</h3>
                  <select
                    multiple
                    size={10}
                    className="w-full h-full border-0 focus:ring-0"
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value, 10));
                      selected.forEach(handleMoveToAvailable);
                    }}
                  >
                    {chosenPerms.map(perm => (
                      <option key={perm.id} value={perm.id}>{perm.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formErrors.permissions?.map((m, i) => (
                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
              ))}

              {formErrors.name && formErrors.name.some(msg => msg.toLowerCase().includes('already exists')) && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                  ⚠️ Ya existe un grupo con este nombre. Elige otro.
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/administrador/grupos')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GrupoForm;
