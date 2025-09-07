// src/pages/Admin/Bitacora/BitacoraList.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchBitacoras, fetchUsuarios } from '../../../api/api'
import type { Bitacora, CustomUser } from '../../../types'

const BitacoraList: React.FC = () => {
  const [entries, setEntries] = useState<Bitacora[]>([])
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState<CustomUser[]>([])
  const navigate = useNavigate()

  const load = async () => {
    try {
      setLoading(true)
      const data = await fetchBitacoras()
      setEntries(data)
    } catch (err) {
      console.error('Error cargando bitácoras', err)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const data = await fetchUsuarios()
      setUsuarios(data)
    } catch (err) {
      console.error('Error usuarios', err)
    }
  }


  useEffect(() => {
    load();
    loadUsers();
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Historial de Sesiones</h2>
      {loading
        ? <p>Cargando bitácoras…</p>
        : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                 <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Usuario</th>
                <th className="px-4 py-2 border">Login</th>
                <th className="px-4 py-2 border">Logout</th>
                <th className="px-4 py-2 border">IP</th>
                <th className="px-4 py-2 border">Dispositivo</th>
                <th className="px-4 py-2 border">Detalle  </th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id}>
                  <td className="px-4 py-2 border">{e.id}</td>
                   <td className="px-4 py-2 border">{usuarios.find((u) =>u.id ==e.usuario)?.username}</td>
                  <td className="px-4 py-2 border">{new Date(e.login).toLocaleString()}</td>
                  <td className="px-4 py-2 border">
                    {e.logout ? new Date(e.logout).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-2 border">{e.ip ?? '—'}</td>
                  <td className="px-4 py-2 border">{e.device ?? '—'}</td>
                  <td className="px-4 py-2 border">
                  <button
                    onClick={() => navigate(`/administrador/bitacoras/${e.id}`)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Ver
                  </button>
                </td>

                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  )
}

export default BitacoraList
