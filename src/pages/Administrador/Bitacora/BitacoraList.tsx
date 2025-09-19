// src/pages/Admin/Bitacora/BitacoraList.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchBitacoras } from '../../../api/api-bitacora'
import type{ Bitacora } from '../../../types/type-bitacora'
import { fetchUsuarios } from '../../../api/api'
import { toUiError } from '../../../api/error'
import type { CustomUser } from '../../../types/type-customuser'

const BitacoraList: React.FC = () => {
  const [entries, setEntries] = useState<Bitacora[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usuarios, setUsuarios] = useState<CustomUser[]>([])
  const navigate = useNavigate()

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchBitacoras()
      setEntries(Array.isArray(data) ? data : [])
    } catch (err) {
      const uiError = toUiError(err)
      setError(uiError.message)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const data = await fetchUsuarios()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error cargando usuarios:', err)
      // No mostramos error al usuario aquí, solo fallback en UI
    }
  }

  useEffect(() => {
    load()
    loadUsers()
  }, [])

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Historial de Sesiones</h2>

      {/* Estado: Cargando */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando bitácoras…</p>
        </div>
      )}

      {/* Estado: Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">⚠️</span>
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={load}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado: Sin datos (solo si no hay error y no está cargando) */}
      {!loading && !error && entries.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-lg mb-6 text-center">
          <span aria-hidden="true">ℹ️</span> <strong>No hay registros de sesiones disponibles.</strong>
        </div>
      )}

      {/* Tabla: Solo si hay datos */}
      {!loading && !error && entries.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left border-b font-medium text-gray-700">ID</th>
                <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Usuario</th>
                <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Login</th>
                <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Logout</th>
                <th className="px-4 py-3 text-left border-b font-medium text-gray-700">IP</th>
                <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Dispositivo</th>
                <th className="px-4 py-3 text-left border-b font-medium text-gray-700">Acción</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border-b">{e.id}</td>
                  <td className="px-4 py-3 border-b">
                    {usuarios.find(u => u.id === e.usuario)?.username || 'Desconocido'}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {new Date(e.login).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {e.logout ? new Date(e.logout).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3 border-b">{e.ip || '—'}</td>
                  <td className="px-4 py-3 border-b">{e.device || '—'}</td>
                  <td className="px-4 py-3 border-b">
                    <button
                      onClick={() => navigate(`/administrador/bitacoras/${e.id}`)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BitacoraList