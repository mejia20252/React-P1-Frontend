import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, type FormState } from '../../../schemas/role'; // 👈 usa FormState

type ApiRol = { id: number | string; nombre: string };

const RolesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormState>({                // 👈 usa FormState aquí
    resolver: zodResolver(roleSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { nombre: '' },        // 👈 coincide con FormState
  });

  useEffect(() => {
    const loadRol = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get<ApiRol>(`/roles/${id}/`);
        reset({ nombre: data?.nombre ?? '' }); // 👈 reset con FormState
      } catch {
        setTopError('No se pudo cargar el rol.');
      } finally {
        setLoading(false);
      }
    };
    loadRol();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: FormState) => { // 👈 values tipado con FormState
    setTopError('');
    try {
      if (isEdit && id) {
        await axiosInstance.patch(`/roles/${id}/`, values, { validateStatus: s => s >= 200 && s < 300 });
      } else {
        await axiosInstance.post(`/roles/`, values, { validateStatus: s => s >= 200 && s < 300 });
      }
      navigate('/administrador/roles');
    } catch (error) {
      const ui = toUiError(error); // { message, fields?: Record<string,string[]> }
      if (ui.message) setTopError(ui.message);

      // Mapear errores del backend a RHF usando las claves de FormState
      if (ui.fields) {
        (Object.keys(ui.fields) as (keyof FormState)[]).forEach((field) => {
          const msgs = ui.fields?.[field as string];
          const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs ?? '');
          // Solo seteamos si el field existe en FormState
          if (field in ({} as FormState)) {
            setError(field, { type: 'server', message });
          } else {
            // Campos no mapeados → topError
            if (message) setTopError(prev => (prev ? `${prev} ${message}` : message));
          }
        });
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">{isEdit ? 'Editar Rol' : 'Nuevo Rol'}</h2>

      {topError && <div className="mb-3 p-2 rounded bg-red-100 text-red-700">{topError}</div>}

      {loading ? (
        <p>Cargando datos…</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 max-w-md">
          <div>
            <label htmlFor="nombre" className="block mb-1">Nombre</label>
            <input
              id="nombre"
              type="text"
              {...register('nombre')}                 // 👈 campo de FormState
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? 'nombre-err' : undefined}
              className="w-full border px-2 py-1 rounded"
              onInput={(e) => {
                const target = e.currentTarget;
                if (target.value.length > 10) target.value = target.value.slice(0, 10);
              }}
            />
            {errors.nombre && (
              <p id="nombre-err" className="text-xs text-red-600 mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
              {isSubmitting ? 'Guardando…' : 'Guardar'}
            </button>
            <button type="button" onClick={() => navigate('/administrador/roles')} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancelar
            </button>
          </div>

          {isDirty && <p className="text-xs text-gray-500">Tienes cambios sin guardar.</p>}
        </form>
      )}
    </div>
  );
};

export default RolesForm;


/**
 * import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, type RoleForm } from '../../../schemas/role';

type ApiRol = { id: number | string; nombre: string };
type FormState={
  nombre:string;
}
const RolesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [topError, setTopError] = useState<string>(''); // error general

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { nombre: '' },
  });

  // Cargar rol si es edición
  useEffect(() => {
    const loadRol = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get<ApiRol>(`/roles/${id}/`);
        // Pre-cargamos el form
        reset({ nombre: data?.nombre ?? '' });
      } catch (_err) {
        setTopError('No se pudo cargar el rol.');
      } finally {
        setLoading(false);
      }
    };
    loadRol();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: RoleForm) => {
    setTopError('');
    try {
      if (isEdit && id) {
        await axiosInstance.patch(`/roles/${id}/`, values, {
          validateStatus: (s) => s >= 200 && s < 300,
        });
      } else {
        await axiosInstance.post(`/roles/`, values, {
          validateStatus: (s) => s >= 200 && s < 300,
        });
      }
      navigate('/administrador/roles');
    } catch (error) {
      const ui = toUiError(error); // { message, fields?: Record<string,string[]> }
      // error general
      if (ui.message) setTopError(ui.message);

      // errores por campo desde el backend → RHF
      if (ui.fields) {
        Object.entries(ui.fields).forEach(([field, msgs]) => {
          const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
          if (field in roleSchema.shape) {
            setError(field as keyof RoleForm, { type: 'server', message });
          } else {
            // Si el backend envía un campo no mapeado, lo mostramos en topError
            setTopError((prev) => prev ? `${prev} ${message}` : message);
          }
        });
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? 'Editar Rol' : 'Nuevo Rol'}
      </h2>

      {topError && (
        <div className="mb-3 p-2 rounded bg-red-100 text-red-700">{topError}</div>
      )}

      {loading ? (
        <p>Cargando datos…</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 max-w-md">
          <div>
            <label htmlFor="nombre" className="block mb-1">Nombre</label>
            <input
              id="nombre"
              type="text"
              {...register('nombre')}
              maxLength={10} // ayuda de UX (el schema es la verdad)
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? 'nombre-err' : undefined}
              className="w-full border px-2 py-1 rounded"
              onInput={(e) => {
                // si quieres forzar recorte “en vivo”:
                const target = e.currentTarget;
                if (target.value.length > 10) target.value = target.value.slice(0, 10);
              }}
            />
            {errors.nombre && (
              <p id="nombre-err" className="text-xs text-red-600 mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando…' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/administrador/roles')}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>

          {/* Opcional: aviso al salir con cambios sin guardar *
          {isDirty && (
            <p className="text-xs text-gray-500">Tienes cambios sin guardar.</p>
          )}
        </form>
      )}
    </div>
  );
};

export default RolesForm;

 */