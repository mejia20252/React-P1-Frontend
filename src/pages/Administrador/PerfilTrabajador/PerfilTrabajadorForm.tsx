import React, { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

// Definición de tipos para la API
interface ApiUsuario {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
}

interface ApiPerfilTrabajador {
  id: number | string;
  usuario: number;
  especialidades: string[];
  activo: boolean;
  salario: number | null;
  horario_laboral: string | null; // Can be null from API, we'll convert to '' for form
  supervisor: number | null;
  observaciones: string | null; // Can be null from API, we'll convert to '' for form
}

// Tipo para el estado del formulario
interface FormInput {
  usuario: number;
  especialidades: string; // Keep as string for input, transform later
  activo: boolean;
  salario: string; // Keep as string for input to handle empty/non-numeric
  horario_laboral: string; // Use string, convert null to '' for form
  supervisor: string; // Keep as string for input to handle empty selection
  observaciones: string; // Use string, convert null to '' for form
}

// Tipo para los errores del formulario
type FormErrors = {
  [K in keyof FormInput]?: string;
} & { topError?: string };

const commonSchedules = [
  'Lunes a Viernes, 9am-5pm',
  'Lunes a Viernes, 8am-4pm',
  'Lunes a Sábado, 9am-1pm',
  'Fin de semana, 10am-4pm',
  'Horario flexible',
];

const PerfilTrabajadorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormInput>({
    usuario: 0,
    especialidades: '',
    activo: true,
    salario: '',
    horario_laboral: '',
    supervisor: '',
    observaciones: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [supervisores, setSupervisores] = useState<ApiUsuario[]>([]);

  // Cargar lista de usuarios y supervisores
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const [usersRes, adminsRes] = await Promise.all([
          axiosInstance.get<ApiUsuario[]>('/usuarios/'),
          axiosInstance.get<ApiUsuario[]>('/usuarios/?rol__nombre=Administrador')
        ]);
        setUsuarios(usersRes.data.filter(u => u.nombre && u.apellido_paterno));
        setSupervisores(adminsRes.data.filter(u => u.nombre && u.apellido_paterno));
      } catch (err) {
        console.error('Error al cargar usuarios o administradores', err);
        toast.error('Error al cargar listas de usuarios.');
      }
    };
    fetchUsuarios();
  }, []);

  // Cargar datos en modo edición
  useEffect(() => {
    const loadPerfilTrabajador = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get<ApiPerfilTrabajador>(`/perfiles-trabajador/${id}/`);
        setFormData({
          usuario: data.usuario,
          especialidades: data.especialidades.join(', '),
          activo: data.activo,
          salario: data.salario !== null ? data.salario.toString() : '',
          horario_laboral: data.horario_laboral || '', // Convert null to empty string for form
          supervisor: data.supervisor?.toString() || '',
          observaciones: data.observaciones || '', // Convert null to empty string for form
        });
        setIsDirty(false); // Reset dirty state after loading
      } catch (err) {
        setErrors({ topError: 'No se pudo cargar el perfil de trabajador.' });
        toast.error('Error al cargar el perfil de trabajador.');
      } finally {
        setLoading(false);
      }
    };
    loadPerfilTrabajador();
  }, [id, isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setIsDirty(true);
    // Clear error for the field being changed
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof FormInput];
      return newErrors;
    });
  };

  const validateForm = (data: FormInput): FormErrors => {
    const newErrors: FormErrors = {};

    if (data.usuario <= 0) {
      newErrors.usuario = 'Debe seleccionar un usuario.';
    }
    if (!data.especialidades.trim()) {
      newErrors.especialidades = 'Debe especificar al menos una especialidad.';
    }

    if (data.salario !== '') {
      const salaryNum = Number(data.salario);
      if (isNaN(salaryNum) || salaryNum <= 0) {
        newErrors.salario = 'El salario debe ser un número positivo.';
      }
    }

    if (data.supervisor !== '') {
      const supervisorNum = Number(data.supervisor);
      if (isNaN(supervisorNum) || supervisorNum <= 0) {
        newErrors.supervisor = 'Debe seleccionar un supervisor válido.';
      }
    }

    return newErrors;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setIsSubmitting(true);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      toast.error('Por favor, corrija los errores del formulario.');
      return;
    }

    // Transform data for API
    const payload = {
      ...formData,
      especialidades: formData.especialidades.split(',').map(s => s.trim()).filter(Boolean),
      salario: formData.salario === '' ? null : Number(formData.salario),
      supervisor: formData.supervisor === '' ? null : Number(formData.supervisor),
      // IMPORTANT: Send empty strings "" for optional CharFields if empty, not null,
      // as Django's CharField(blank=True) expects empty strings, not nulls, by default.
      horario_laboral: formData.horario_laboral, // Send as is, empty string if user left it blank
      observaciones: formData.observaciones,     // Send as is, empty string if user left it blank
    };

    try {
      if (isEdit && id) {
        await axiosInstance.patch(`/perfiles-trabajador/${id}/`, payload);
       // toast.success('Perfil de trabajador actualizado exitosamente.');
      } else {
        await axiosInstance.post(`/perfiles-trabajador/`, payload);
        //toast.success('Perfil de trabajador creado exitosamente.');
      }
      navigate('/administrador/perfiltrabajador');
    } catch (error) {
      console.error('Error al guardar perfil de trabajador', error);
      const ui = toUiError(error);
      const apiErrors: FormErrors = {};
      if (ui.message) apiErrors.topError = ui.message;

      if (ui.fields) {
        (Object.keys(ui.fields) as (keyof FormInput)[]).forEach((field) => {
          const msgs = ui.fields?.[field as string];
          const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs ?? '');
          if (field in formData) {
            apiErrors[field] = message;
          } else {
            if (message) apiErrors.topError = (apiErrors.topError ? `${apiErrors.topError} ${message}` : message);
          }
        });
      }
      setErrors(apiErrors);
      toast.error(ui.message || 'Error al guardar el perfil de trabajador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Perfil de Trabajador' : 'Nuevo Perfil de Trabajador'}</h2>
          <button
            onClick={() => navigate('/administrador/perfiltrabajador')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Volver a la lista de perfiles de trabajador"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {errors.topError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
            {errors.topError}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <p className="text-gray-600">Cargando datos…</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-6">
            {/* Campo Usuario */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <select
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                aria-invalid={!!errors.usuario}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isEdit} // Disable user selection in edit mode
              >
                <option value={0}>Seleccione un usuario...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido_paterno} ({u.email})
                  </option>
                ))}
              </select>
              {errors.usuario && (
                <p id="usuario-err" className="mt-2 text-sm text-red-600">
                  {errors.usuario}
                </p>
              )}
            </div>

            {/* Campo Especialidades */}
            <div>
              <label htmlFor="especialidades" className="block text-sm font-medium text-gray-700 mb-1">
                Especialidades (separadas por coma)
              </label>
              <input
                id="especialidades"
                type="text"
                name="especialidades"
                value={formData.especialidades}
                onChange={handleChange}
                placeholder="Ej. Plomería, Electricidad, Jardinería"
                aria-invalid={!!errors.especialidades}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.especialidades && (
                <p id="especialidades-err" className="mt-2 text-sm text-red-600">
                  {errors.especialidades}
                </p>
              )}
            </div>

            {/* Campo Activo */}
            <div className="flex items-center">
              <input
                id="activo"
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                Activo
              </label>
            </div>

            {/* Campo Salario */}
            <div>
              <label htmlFor="salario" className="block text-sm font-medium text-gray-700 mb-1">
                Salario (opcional)
              </label>
              <input
                id="salario"
                type="number"
                step="0.01"
                name="salario"
                value={formData.salario}
                onChange={handleChange}
                placeholder="Ej. 1500.00"
                aria-invalid={!!errors.salario}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.salario && (
                <p id="salario-err" className="mt-2 text-sm text-red-600">
                  {errors.salario}
                </p>
              )}
            </div>

            {/* Campo Horario Laboral - Con datalist para sugerencias */}
            <div>
              <label htmlFor="horario_laboral" className="block text-sm font-medium text-gray-700 mb-1">
                Horario Laboral (opcional)
              </label>
              <input
                id="horario_laboral"
                type="text" // Keep as text to allow free input
                name="horario_laboral"
                value={formData.horario_laboral}
                onChange={handleChange}
                placeholder="Ej. Lunes a Viernes, 8am-5pm"
                list="common-schedules" // Link to datalist
                aria-invalid={!!errors.horario_laboral}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <datalist id="common-schedules">
                {commonSchedules.map((schedule, index) => (
                  <option key={index} value={schedule} />
                ))}
              </datalist>
              {errors.horario_laboral && (
                <p id="horario_laboral-err" className="mt-2 text-sm text-red-600">
                  {errors.horario_laboral}
                </p>
              )}
            </div>

            {/* Campo Supervisor */}
            <div>
              <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700 mb-1">
                Supervisor (opcional)
              </label>
              <select
                id="supervisor"
                name="supervisor"
                value={formData.supervisor}
                onChange={handleChange}
                aria-invalid={!!errors.supervisor}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione un supervisor...</option>
                {supervisores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} {s.apellido_paterno} ({s.email})
                  </option>
                ))}
              </select>
              {errors.supervisor && (
                <p id="supervisor-err" className="mt-2 text-sm text-red-600">
                  {errors.supervisor}
                </p>
              )}
            </div>

            {/* Campo Observaciones */}
            <div>
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones (opcional)
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Notas adicionales sobre el trabajador..."
                rows={3}
                aria-invalid={!!errors.observaciones}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              {errors.observaciones && (
                <p id="observaciones-err" className="mt-2 text-sm text-red-600">
                  {errors.observaciones}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/administrador/perfiltrabajador')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
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
            {isDirty && (
              <p className="text-sm text-center text-gray-500 mt-4">Tienes cambios sin guardar.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PerfilTrabajadorForm;