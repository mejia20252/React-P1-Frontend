// src/pages/Administrador/Pago/PagoForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { pagoApi } from '../../../api/api-pago';
import { cuotaApi } from '../../../api/api-cuota';
import { reservaApi } from '../../../api/api-reserva';
import { conceptoPagoApi } from '../../../api/api-concepto-pago';
import * as usuarioApi from '../../../api/api-usuario'; // ✅ Corrección: import * as
import type { Cuota } from '../../../types/type-cuota';
import type { Reserva } from '../../../types/type-reserva';
import type { ConceptoPago } from '../../../types/type-concepto-pago';
import type { Usuario } from '../../../types/type-usuario';
import type { PagoFormData } from '../../../schemas/schema-pago';
import { toUiError } from '../../../api/error';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pagoCreateSchema } from '../../../schemas/schema-pago';
const PagoForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [topError, setTopError] = useState('');
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
    const [cuotas, setCuotas] = useState<Cuota[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [conceptos, setConceptos] = useState<ConceptoPago[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        // ✅ Eliminado: conceptoValue (no se usaba)
        // const conceptoValue = watch('concepto');
        formState: { isSubmitting, errors },
    } = useForm<PagoFormData>({
        resolver: zodResolver(pagoCreateSchema),
        defaultValues: {
            cuota: null,
            reserva: null,
            concepto: 0,
            monto: '',
            metodo_pago: 'efectivo',
            referencia: '',
            pagado_por: null,
        },
    });

    // Cargar listas y datos si es edición
    useEffect(() => {
        const loadDependencies = async () => {
            try {
                // ✅ Asegúrate de que usuarioApi tenga `fetchUsuarios` (o renombra según tu API)
                const [cuotasData, reservasData, conceptosData, usuariosData] = await Promise.all([
                    cuotaApi.getAll(),
                    reservaApi.getAll(),
                    conceptoPagoApi.getAll(),
                    usuarioApi.fetchUsuarios(), // ✅ Cambiado de getAll → fetchUsuarios
                ]);
                setCuotas(cuotasData);
                setReservas(reservasData);
                setConceptos(conceptosData);
                setUsuarios(usuariosData);

                if (isEdit && id) {
                    setLoading(true);
                    const pago = await pagoApi.getById(Number(id));
                    setValue('cuota', pago.cuota);
                    setValue('reserva', pago.reserva);
                    setValue('concepto', pago.concepto);
                    setValue('monto', pago.monto);
                    setValue('metodo_pago', pago.metodo_pago);
                    setValue('referencia', pago.referencia || '');
                    setValue('pagado_por', pago.pagado_por);
                }
            } catch (error) {
                console.error('Error al cargar dependencias:', error);
                setTopError('Error al cargar datos necesarios.');
            } finally {
                setLoading(false);
            }
        };

        loadDependencies();
    }, [id, isEdit, setValue]);

    const onSubmit: SubmitHandler<PagoFormData> = async (data) => {
        setTopError('');
        setServerErrors({});

        try {
            if (isEdit && id) {
                await pagoApi.update(Number(id), data);
            } else {
                await pagoApi.create(data);
            }

            navigate('/administrador/pagos');
        } catch (error) {
            const uiError = toUiError(error);
            if (uiError.fields) {
                setServerErrors(uiError.fields);
            } else if (uiError.message) {
                setTopError(uiError.message);
            } else {
                setTopError('Error al guardar el pago.');
            }
        }
    };

    if (loading && isEdit) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Editar Pago' : 'Nuevo Pago'}
                    </h2>
                    <button
                        onClick={() => navigate('/administrador/pagos')}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        aria-label="Cerrar"
                    >
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                {topError && (
                    <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
                        {topError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                    {/* Concepto */}
                    <div>
                        <label htmlFor="concepto" className="block text-sm font-medium text-gray-700 mb-1">
                            Concepto *
                        </label>
                        <select
                            id="concepto"
                            {...register('concepto', { valueAsNumber: true })}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.concepto || serverErrors.concepto ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Selecciona un concepto</option>
                            {conceptos.map((concepto: ConceptoPago) => (
                                <option key={concepto.id} value={concepto.id}>
                                    {concepto.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.concepto && <p className="mt-1 text-sm text-red-600">{errors.concepto.message}</p>}
                        {serverErrors.concepto?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
                    </div>

                    {/* Cuota (opcional) */}
                    <div>
                        <label htmlFor="cuota" className="block text-sm font-medium text-gray-700 mb-1">
                            Cuota (opcional)
                        </label>
                        <select
                            id="cuota"
                            {...register('cuota', { valueAsNumber: true })}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.cuota || serverErrors.cuota ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Ninguna</option>
                            {cuotas.map(cuota => (
                                <option key={cuota.id} value={cuota.id}>
                                    {/* ✅ Corrección: evitamos acceder a propiedades que quizás no existen */}
                                    Cuota ID: {cuota.id} - {cuota.periodo ? new Date(cuota.periodo).toLocaleDateString() : 'Sin fecha'}
                                </option>
                            ))}
                        </select>
                        {errors.cuota && <p className="mt-1 text-sm text-red-600">{errors.cuota.message}</p>}
                        {serverErrors.cuota?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
                    </div>

                    {/* Reserva (opcional) */}
                    <div>
                        <label htmlFor="reserva" className="block text-sm font-medium text-gray-700 mb-1">
                            Reserva (opcional)
                        </label>
                        <select
                            id="reserva"
                            {...register('reserva', { valueAsNumber: true })}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.reserva || serverErrors.reserva ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Ninguna</option>
                            {reservas.map(reserva => (
                                <option key={reserva.id} value={reserva.id}>
                                     - {reserva.fecha} {reserva.hora_inicio}
                                </option>
                            ))}
                        </select>
                        {errors.reserva && <p className="mt-1 text-sm text-red-600">{errors.reserva.message}</p>}
                        {serverErrors.reserva?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
                    </div>

                    {/* Monto */}
                    <div>
                        <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
                            Monto *
                        </label>
                        <input
                            type="text"
                            id="monto"
                            {...register('monto')}
                            placeholder="0.00"
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.monto || serverErrors.monto ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.monto && <p className="mt-1 text-sm text-red-600">{errors.monto.message}</p>}
                        {serverErrors.monto?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
                    </div>

                    {/* Método de Pago */}
                    <div>
                        <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700 mb-1">
                            Método de Pago *
                        </label>
                        <select
                            id="metodo_pago"
                            {...register('metodo_pago')}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.metodo_pago || serverErrors.metodo_pago ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="qr">Pago QR</option>
                        </select>
                        {errors.metodo_pago && <p className="mt-1 text-sm text-red-600">{errors.metodo_pago.message}</p>}
                        {serverErrors.metodo_pago?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
                    </div>

                    {/* Referencia */}
                    <div>
                        <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 mb-1">
                            Referencia (opcional)
                        </label>
                        <input
                            type="text"
                            id="referencia"
                            {...register('referencia')}
                            placeholder="N° de transacción, comprobante, etc."
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.referencia || serverErrors.referencia ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.referencia && <p className="mt-1 text-sm text-red-600">{errors.referencia.message}</p>}
                        {serverErrors.referencia?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
                    </div>

                    {/* Pagado por */}
                    <div>
                        <label htmlFor="pagado_por" className="block text-sm font-medium text-gray-700 mb-1">
                            Pagado por (opcional)
                        </label>
                        <select
                            id="pagado_por"
                            {...register('pagado_por', { valueAsNumber: true })}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.pagado_por || serverErrors.pagado_por ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Selecciona un usuario</option>
                            {usuarios.map(usuario => (
                                <option key={usuario.id} value={usuario.id}>{usuario.email}</option>
                            ))}
                        </select>
                        {errors.pagado_por && <p className="mt-1 text-sm text-red-600">{errors.pagado_por.message}</p>}
                        {serverErrors.pagado_por?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
                    </div>

                    {/* Comprobante (solo en creación) */}
                    {!isEdit && (
                        <div>
                            <label htmlFor="comprobante" className="block text-sm font-medium text-gray-700 mb-1">
                                Comprobante (opcional)
                            </label>
                            <input
                                type="file"
                                id="comprobante"
                                accept="image/*,.pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setValue('comprobante', file);
                                }}
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                            />
                            {errors.comprobante && <p className="mt-1 text-sm text-red-600">{errors.comprobante.message}</p>}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('/administrador/pagos')}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
                                    {isEdit ? 'Actualizar' : 'Crear'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PagoForm;