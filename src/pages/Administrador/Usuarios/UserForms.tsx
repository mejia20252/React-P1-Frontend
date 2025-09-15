// src/pages/Admin/Users/UserForms.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoles } from '../../../api/rol';
import { fetchUser, createUser, updateUser } from '../../../api/user';
import type { CustomUserResponse, CreateUserPayload } from '../../../types/user';
import type { Rol } from '../../../types/index';
import { toUiError } from '../../../api/error';
import { userSchema, type UserFormState } from '../../../schemas/user';

const UserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

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

        fecha_inicio_contrato: null,
        fecha_fin_contrato: null,
        fecha_adquisicion: null,
        numero_licencia: null,
        tipo_personal: null,
        fecha_ingreso: null,
        salario: null,
    });

    const [roles, setRoles] = useState<Rol[]>([]);
    const [rolNombre, setRolNombre] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [topError, setTopError] = useState<string>('');
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

    // Cargar roles al montar
    useEffect(() => {
        fetchRoles()
            .then(setRoles)
            .catch(console.error);
    }, []);

    // Cargar usuario si es edición
    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            fetchUser(+id)
                .then((user: CustomUserResponse) => {
                    setForm({
                        username: user.username,
                        password: '', // No mostrar contraseña en edición
                        confirm: '',
                        rol: user.rol.id,
                        nombre: user.nombre,
                        apellido_paterno: user.apellido_paterno,
                        apellido_materno: user.apellido_materno,
                        sexo: user.sexo || null,
                        email: user.email || null,
                        direccion: user.direccion || null,
                        fecha_nacimiento: user.fecha_nacimiento || null,

                        fecha_inicio_contrato: user.fecha_inicio_contrato || null,
                        fecha_fin_contrato: user.fecha_fin_contrato || null,
                        fecha_adquisicion: user.fecha_adquisicion || null,
                        numero_licencia: user.numero_licencia || null,
                        tipo_personal: user.tipo_personal || null,
                        fecha_ingreso: user.fecha_ingreso || null,
                        salario: user.salario || null,
                    });

                    setRolNombre(user.rol.nombre);
                })
                .catch((err) => {
                    const { message, fields } = toUiError(err);
                    setTopError(message);
                    if (fields) setFormErrors(fields);
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: name === 'rol' ? (value ? Number(value) : null) : value,
        }));

        if (name === 'rol') {
            const selectedRol = roles.find(r => r.id === (value ? Number(value) : null));
            setRolNombre(selectedRol?.nombre || null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTopError('');
        setFormErrors({});

        // ✅ VALIDACIÓN CON ZOD
        const result = userSchema.safeParse({
            ...form,
            rolNombre,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setFormErrors(fieldErrors);
            setTopError('Por favor corrige los errores en el formulario.');
            return;
        }

        // ✅ VALIDACIÓN ADICIONAL: ASEGURARSE DE QUE ROL ESTÉ SELECCIONADO
        if (form.rol === null) {
            setFormErrors({
                rol: ["Debe seleccionar un rol."],
            });
            setTopError("Debe seleccionar un rol.");
            return;
        }

        try {
            const payload: CreateUserPayload = {
                username: form.username,
                password: form.password || '',
                email: form.email || undefined,
                nombre: form.nombre,
                apellido_paterno: form.apellido_paterno,
                apellido_materno: form.apellido_materno,
                sexo: form.sexo || undefined,
                direccion: form.direccion || undefined,
                fecha_nacimiento: form.fecha_nacimiento || undefined,
                rol_nombre: rolNombre as string,
                fecha_inicio_contrato: form.fecha_inicio_contrato || undefined,
                fecha_fin_contrato: form.fecha_fin_contrato || undefined,
                fecha_adquisicion: form.fecha_adquisicion || undefined,
                numero_licencia: form.numero_licencia || undefined,
                tipo_personal: form.tipo_personal || undefined,
                fecha_ingreso: form.fecha_ingreso || undefined,
                salario: form.salario || undefined,
            };
            // ✅ AÑADIR CONSOLE.LOG PARA VER EL PAYLOAD
        console.log('Payload enviado al backend:', payload);
            setLoading(true);
            if (isEdit && id) {
                await updateUser(+id, payload);
            } else {
                await createUser(payload);
            }

            navigate('/administrador/usuarios');
        } catch (err) {
            const { message, fields } = toUiError(err);
            setTopError(message);
            console.log('e', fields);

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
                        {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
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
                    <div className="text-center py-12 text-gray-500">Guardando cambios...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
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
                                        required
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
                                        value={form.email ?? ''} // ✅ CORREGIDO
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
                                        required
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
                                        required
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
                                        required
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
                                        value={form.fecha_nacimiento ?? ''} // ✅ CORREGIDO
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
                                        value={form.direccion ?? ''} // ✅ CORREGIDO
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {formErrors.direccion?.map((m, i) => (
                                        <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña{isEdit ? ' (dejar en blanco para no cambiar)' : ' *'}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password ?? ''}
                                onChange={handleChange}
                                required={!isEdit}
                                placeholder={isEdit ? 'Dejar vacío para no cambiar' : 'Ingrese su contraseña'}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {formErrors.password?.map((m, i) => (
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
                                {formErrors.rolNombre?.map((m, i) => (
                                    <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                ))}

                                {form.rol && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        <strong>Rol seleccionado:</strong> {getRolNombre(form.rol)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Campos Dinámicos por Rol */}
                        {rolNombre === "Inquilino" && (
                            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                    Datos de Inquilino
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de inicio de contrato *
                                        </label>
                                        <input
                                            type="date"
                                            name="fecha_inicio_contrato"
                                            value={form.fecha_inicio_contrato ?? ''} // ✅ CORREGIDO
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.fecha_inicio_contrato ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.fecha_inicio_contrato?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de fin de contrato *
                                        </label>
                                        <input
                                            type="date"
                                            name="fecha_fin_contrato"
                                            value={form.fecha_fin_contrato ?? ''} // ✅ CORREGIDO
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.fecha_fin_contrato ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.fecha_fin_contrato?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {rolNombre === "Propietario" && (
                            <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                                    </svg>
                                    Datos de Propietario
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de adquisición *
                                        </label>
                                        <input
                                            type="date"
                                            name="fecha_adquisicion"
                                            value={form.fecha_adquisicion ?? ''} // ✅ CORREGIDO
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.fecha_adquisicion ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.fecha_adquisicion?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {rolNombre === "Administrador" && (
                            <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    Datos de Administrador
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Número de licencia *
                                        </label>
                                        <input
                                            type="text"
                                            name="numero_licencia"
                                            value={form.numero_licencia ?? ''} // ✅ CORREGIDO
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.numero_licencia ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.numero_licencia?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>
                                    {/* NUEVO: Fecha de certificación */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de certificación
                                        </label>
                                        <input
                                            type="date"
                                            name="fecha_certificacion"
                                            value={form.fecha_certificacion ?? ''}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.fecha_certificacion ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.fecha_certificacion?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>
                                    {/* NUEVO: Empresa */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Empresa
                                        </label>
                                        <input
                                            type="text"
                                            name="empresa"
                                            value={form.empresa ?? ''}
                                            onChange={handleChange}
                                            placeholder="Nombre de la empresa o institución"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.empresa ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.empresa?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        )}

                        {rolNombre === "Personal" && (
                            <div className="mb-8 p-6 bg-orange-50 rounded-xl border border-orange-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                    Datos de Personal
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo de personal *
                                        </label>
                                        <select
                                            name="tipo_personal"
                                            value={form.tipo_personal ?? ''} // ✅ CORREGIDO
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.tipo_personal ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">-- Seleccione tipo --</option>
                                            <option value="seguridad">Seguridad</option>
                                            <option value="mantenimiento">Mantenimiento</option>
                                            <option value="limpieza">Limpieza</option>
                                            <option value="jardineria">Jardinería</option>
                                        </select>
                                        {formErrors.tipo_personal?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de ingreso *
                                        </label>
                                        <input
                                            type="date"
                                            name="fecha_ingreso"
                                            value={form.fecha_ingreso ?? ''} // ✅ CORREGIDO
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.fecha_ingreso ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {formErrors.fecha_ingreso?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Salario (opcional)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="salario"
                                            value={form.salario ?? ''} // ✅ CORREGIDO
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${formErrors.salario ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="0.00"
                                        />
                                        {formErrors.salario?.map((m, i) => (
                                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

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
                                {isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserForm;