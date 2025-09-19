// src/pages/Administrador/TareaMantenimiento/TareaMantenimientoList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { tareaMantenimientoApi } from '../../../api/api-tarea-mantenimiento';
import type { TareaMantenimiento } from '../../../types/type-tarea-mantenimiento';
import { casaApi } from '../../../api/api-casa';
import { areaComunApi } from '../../../api/api-area-comun';
import type { Casa } from '../../../types/type-casa';
import type { AreaComun } from '../../../types/type-area-comun';
import type { PrioridadTarea, EstadoTarea } from '../../../types/type-tarea-mantenimiento';
const TareaMantenimientoList: React.FC = () => {
  const [tareas, setTareas] = useState<TareaMantenimiento[]>([]);
  const [casas, setCasas] = useState<Record<number, Casa>>({});
  const [areas, setAreas] = useState<Record<number, AreaComun>>({});
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tareasData, casasData, areasData] = await Promise.all([
          tareaMantenimientoApi.getAll(),
          casaApi.getAll(),
          areaComunApi.getAll(),
        ]);

        setTareas(tareasData);

        const casasMap = casasData.reduce((acc, casa) => {
          acc[casa.id] = casa;
          return acc;
        }, {} as Record<number, Casa>);
        setCasas(casasMap);

        const areasMap = areasData.reduce((acc, area) => {
          acc[area.id] = area;
          return acc;
        }, {} as Record<number, AreaComun>);
        setAreas(areasMap);

      } catch (error) {
        console.error('Error al cargar tareas:', error);
        setTopError('No se pudieron cargar las tareas de mantenimiento.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      await tareaMantenimientoApi.delete(id);
      setTareas(tareas.filter(t => t.id !== id));
    } catch (error) {
      alert('No se pudo eliminar la tarea.');
    }
  };

  const getUbicacion = (tarea: TareaMantenimiento) => {
    if (tarea.casa && casas[tarea.casa]) {
      return `Casa #${casas[tarea.casa].numero}`;
    }
    if (tarea.area_comun && areas[tarea.area_comun]) {
      return `Área: ${areas[tarea.area_comun].nombre}`;
    }
    if (tarea.ubicacion_personalizada) {
      return tarea.ubicacion_personalizada;
    }
    return 'Sin ubicación';
  };

  const getPrioridadBadge = (prioridad: PrioridadTarea) => {
    const classes = {
      baja: 'bg-blue-100 text-blue-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[prioridad]}`}>
        {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
      </span>
    );
  };

  const getEstadoBadge = (estado: EstadoTarea) => {
    const classes = {
      creada: 'bg-gray-100 text-gray-800',
      asignada: 'bg-blue-100 text-blue-800',
      en_progreso: 'bg-yellow-100 text-yellow-800',
      completada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[estado]}`}>
        {estado.replace('_', ' ').charAt(0).toUpperCase() + estado.replace('_', ' ').slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tareas de Mantenimiento</h1>
        <Link
          to="/administrador/tareas-mantenimiento/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nueva Tarea
        </Link>
      </div>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando tareas...</p>
      ) : tareas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay tareas registradas.</p>
          <Link to="/administrador/tareas-mantenimiento/nuevo" className="text-blue-600 hover:text-blue-800 mt-4 block">
            Registrar una ahora
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tareas.map((tarea) => (
                <tr key={tarea.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tarea.titulo || 'Sin título'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getUbicacion(tarea)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getPrioridadBadge(tarea.prioridad)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getEstadoBadge(tarea.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tarea.costo_estimado ? `$${parseFloat(tarea.costo_estimado).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(tarea.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/administrador/tareas-mantenimiento/${tarea.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(tarea.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TareaMantenimientoList;