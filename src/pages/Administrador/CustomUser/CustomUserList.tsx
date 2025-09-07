// src/pages/Admin/Users/CustomUserList.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUsuarios, deleteUsuario } from '../../../api/api'
import type { CustomUser } from '../../../types'

const CustomUserList: React.FC = () => {
  const [users, setUsers] = useState<CustomUser[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await fetchUsuarios()
      setUsers(data)
    } catch (error) {
      console.error('Error al cargar usuarios', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleEdit = (id: number) => {
    navigate(`/administrador/usuarios/${id}/edit`)
  }

  const handleDelete = async (id: number) => {
   // if (window.confirm('¿Eliminar este usuario?')) {
      try {
        await deleteUsuario(id)
        loadUsers()
      } catch (error) {
        console.error('Error al eliminar usuario', error)
      }
    //}
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Usuarios</h2>
        <button
          onClick={() => navigate('/administrador/usuarios/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Rol</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">{user.rol?.nombre ?? '-'}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CustomUserList