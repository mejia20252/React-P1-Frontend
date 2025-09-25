// src/pages/Admin/Users/UserForm.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoles } from '../../../api/rol';
import { createUser, fetchUser, updateUser } from '../../../api/user';
import type { CreateUserPayload } from '../../../types/user';
import type { Rol } from '../../../types/type-rol';
import { toUiError } from '../../../api/error';
import { userSchema, type UserFormState } from '../../../schemas/user';

const UserForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [form, setForm] = useState<UserFormState>({
        username: '',
        password: '',
        confirm: '',
        rol: null,
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        sexo: null,
        email: null,
        direccion: null,
        fecha_nacimiento: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [topError, setTopError] = useState<string>('');
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

    // Cargar roles y datos del usuario si estamos editando
    useEffect(() => {
        const loadFormData = async () => {
            setLoading(true);
            try {
                const rolesData = await fetchRoles();
                setRoles(rolesData);

                if (isEditing && id) {
                    const userData = await fetchUser(+id);
                    setForm({
                        username: userData.username,
                        password: '', // No precargar por seguridad
                        confirm: '',
                        rol: userData.rol || null, // userData.rol es un número ahora
                        nombre: userData.nombre,
                        apellido_paterno: userData.apellido_paterno,
                        apellido_materno: userData.apellido_materno,
                        sexo: userData.sexo,
                        email: userData.email,
                        direccion: userData.direccion,
                        fecha_nacimiento: userData.fecha_nacimiento,
                    });
                }
            } catch (err) {
                const uiError = toUiError(err);
                setTopError(uiError.message);
                console.error("Error cargando datos:", err);
            } finally {
                setLoading(false);
            }
        };

        loadFormData();
    }, [id, isEditing]);

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'rol' ? (value ? Number(value) : null) : (value === '' ? null : value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTopError('');
        setFormErrors({});
        console.log('📋 Estado completo del formulario:', form);

        // ✅ VALIDACIÓN CON ZOD
        let dataToValidate: Partial<UserFormState> = { ...form };
        if (isEditing && form.password === '') {
            delete dataToValidate.password;
            delete dataToValidate.confirm;
        }

        const result = userSchema.safeParse(dataToValidate);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setFormErrors(fieldErrors);
            setTopError('Por favor corrige los errores en el formulario.');
            return;
        }

        try {
            setLoading(true);

            const { confirm, password, ...cleanPayload } = form;

            const payload: CreateUserPayload = {
                username: cleanPayload.username,
                email: cleanPayload.email || undefined,
                nombre: cleanPayload.nombre,
                apellido_paterno: cleanPayload.apellido_paterno,
                apellido_materno: cleanPayload.apellido_materno,
                sexo: cleanPayload.sexo || undefined,
                direccion: cleanPayload.direccion || undefined,
                fecha_nacimiento: cleanPayload.fecha_nacimiento || undefined,
                rol: form.rol!,
            };

            if (!isEditing || (isEditing && password !== '')) {
                payload.password = password;
            }

            console.log('Payload enviado al backend:', payload);

            if (isEditing && id) {
                await updateUser(+id, payload);
            } else {
                if (!payload.password || payload.password === '') {
                    setFormErrors(prev => ({ ...prev, password: ['La contraseña es obligatoria para crear un usuario.'] }));
                    setTopError('Por favor corrige los errores en el formulario.');
                    return;
                }
                await createUser(payload);
            }
            navigate('/administrador/usuarios');
        } catch (err) {
            const { message, fields } = toUiError(err);
            setTopError(message);
            console.log('Errores de campo:', fields);
            if (fields) setFormErrors(fields);
        } finally {
            setLoading(false);
        }
    };

    const getRolNombre = (id: number | null): string => {
        const rol = roles.find(r => r.id === id);
        return rol ? rol.nombre : '--';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
                    </h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        ← Volver
                    </button>
                </div>

                {topError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {topError}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando formulario...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8" noValidate>
                        {/* Datos Personales */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Datos Personales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de usuario *
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.username?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email (opcional)
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email ?? ''}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.email?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.nombre?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido Paterno *
                                    </label>
                                    <input
                                        type="text"
                                        name="apellido_paterno"
                                        value={form.apellido_paterno}
                                        onChange={handleChange}
                                        
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.apellido_paterno ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.apellido_paterno?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido Materno *
                                    </label>
                                    <input
                                        type="text"
                                        name="apellido_materno"
                                        value={form.apellido_materno}
                                        onChange={handleChange}
                                        
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.apellido_materno ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.apellido_materno?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sexo
                                    </label>
                                    <select
                                        name="sexo"
                                        value={form.sexo || ''}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.sexo ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">-- Seleccione --</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                    {formErrors.sexo?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        type="date"
                                        name="fecha_nacimiento"
                                        value={form.fecha_nacimiento ?? ''}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.fecha_nacimiento?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={form.direccion ?? ''}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.direccion?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="relative mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña {isEditing ? '(dejar en blanco para no cambiar)' : '*'}
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder={isEditing ? 'Dejar en blanco para no cambiar' : 'Ingrese su contraseña'}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.414-1.414a8.007 8.007 0 00-3.5-3.5L4.707 2.293zM12 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                )}
                            </button>
                            {formErrors.password?.map((m, i) => (
                                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                            ))}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="relative mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar contraseña {isEditing ? '(dejar en blanco para no cambiar)' : '*'}
                            </label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirm"
                                value={form.confirm}
                                onChange={handleChange}
                                placeholder={isEditing ? 'Dejar en blanco para no cambiar' : 'Confirme su contraseña'}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${formErrors.confirm ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.414-1.414a8.007 8.007 0 00-3.5-3.5L4.707 2.293zM12 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                )}
                            </button>
                            {formErrors.confirm?.map((m, i) => (
                                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                            ))}
                        </div>

                        {/* Rol */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rol</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Seleccione el rol *
                                </label>
                                <select
                                    name="rol"
                                    value={form.rol ?? ''}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.rol ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">-- Seleccione un rol --</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.nombre}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.rol?.map((m, i) => (
                                    <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                ))}
                                {form.rol && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        <strong>Rol seleccionado:</strong> {getRolNombre(form.rol)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/administrador/usuarios')}
                                className="mr-4 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserForm;