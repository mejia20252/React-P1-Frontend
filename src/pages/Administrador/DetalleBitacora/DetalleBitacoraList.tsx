// src/pages/Admin/Bitacora/BitacoraDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBitacora, fetchDetalleBitacoras } from '../../../api/api'
import type { Bitacora, DetalleBitacora } from '../../../types'

const BitacoraDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [bitacora, setBitacora] = useState<Bitacora | null>(null)//sesta son la sbitacoracs
  const [detalles, setDetalles] = useState<DetalleBitacora[]>([])//esto son s etalled labcor
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        if (id) {
          const b = await fetchBitacora(+id)
          const det = await fetchDetalleBitacoras()
          // Filtrar solo los detalles de esta bitácora:
         
          setBitacora(b)
          setDetalles(det.filter(detalle => detalle.bitacora === +id))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <p className="p-4">Cargando detalle…</p>
  if (!bitacora) return <p className="p-4">Bitácora no encontrada.</p>

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Volver
      </button>
      <h2 className="text-2xl font-semibold mb-2">
        Detalle de sesión de {bitacora.usuario}
      </h2>
      <p>Login: {new Date(bitacora.login).toLocaleString()}</p>
      <p>Logout: {bitacora.logout ? new Date(bitacora.logout).toLocaleString() : '—'}</p>
      <p>IP: {bitacora.ip ?? '—'}</p>
      <p>Device: {bitacora.device ?? '—'}</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Acciones realizadas</h3>
      {detalles.length === 0
        ? <p>No hay acciones registradas.</p>
        : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">Acción</th>
                <th className="px-4 py-2 border">Tabla</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map(d => (
                <tr key={d.id}>
                  <td className="px-4 py-2 border">{new Date(d.fecha).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{d.accion}</td>
                  <td className="px-4 py-2 border">{d.tabla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  )
}

export default BitacoraDetail
