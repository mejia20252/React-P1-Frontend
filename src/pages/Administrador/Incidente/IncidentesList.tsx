// src/components/incidentes/CrearIncidenteList.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom' // 👈 Importamos Link para navegación
import api from '../../../app/axiosInstance'
import { toast } from 'react-toastify'

interface Incidente {
  id: number
  tipo: string
  tipo_display: string
  descripcion: string
  ubicacion: string
  fecha_hora: string
  resuelto: boolean
  resuelto_por_username: string | null
  notificacion_titulo: string | null
}

export default function IncidenteList() {
  const [incidentes, setIncidentes] = useState<Incidente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarIncidentes()
  }, [])

  const cargarIncidentes = async () => {
    setLoading(true)
    try {
      const response = await api.get('/incidentes/')
      setIncidentes(response.data)
    } catch (error) {
      toast.error('❌ Error al cargar los incidentes.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const marcarComoResuelto = async (id: number) => {
    try {
      await api.patch(`/incidentes/${id}/`, { resuelto: true })
      toast.success('✅ Incidente marcado como resuelto.')
      cargarIncidentes()
    } catch (error) {
      toast.error('❌ Error al actualizar el incidente.')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Lista de Incidentes de Seguridad</h2>
        <Link
          to="/administrador/incidentes/nuevo"
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ➕ Nuevo Incidente
        </Link>
      </div>

      {incidentes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No hay incidentes registrados.</p>
          <Link
            to="/admin/incidentes/nuevo"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            Registrar Primer Incidente
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {incidentes.map((incidente) => (
            <div
              key={incidente.id}
              className={`p-4 rounded-lg border transition-all ${
                incidente.resuelto
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      incidente.resuelto
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {incidente.resuelto ? 'Resuelto' : 'Pendiente'}
                    </span>
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                      {incidente.tipo_display}
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                    {incidente.descripcion}
                  </p>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div>📍 <span className="font-medium">{incidente.ubicacion}</span></div>
                    <div>📅 {new Date(incidente.fecha_hora).toLocaleString('es-ES')}</div>
                    {incidente.resuelto && incidente.resuelto_por_username && (
                      <div>✅ Resuelto por: {incidente.resuelto_por_username}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                  {!incidente.resuelto && (
                    <button
                      onClick={() => marcarComoResuelto(incidente.id)}
                      className="px-3 py-2 text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                    >
                      Marcar como Resuelto
                    </button>
                  )}
                  <Link
                    to={`/admin/incidentes/${incidente.id}/editar`}
                    className="px-3 py-2 text-xs md:text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 whitespace-nowrap text-center"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}