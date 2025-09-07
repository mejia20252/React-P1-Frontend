

// src/pages/Login.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toUiError } from '../api/error'
const Login: React.FC = () => {
  const { signin, user,
     signout } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [topError, setTopError] = useState<string>('') // mensaje general arriba del form
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({}) // por campo

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTopError('')
    setFormErrors({})

    try {
      if (user) await signout() // cierra sesión anterior (opcional, para bitácora)

      const me = await signin(username, password)

      switch (me.rol?.nombre) {
        case 'Administrador': navigate('/administrador', { replace: true }); break
        case 'personal':       navigate('/personal',       { replace: true }); break
        case 'cliente':        navigate('/cliente',        { replace: true }); break
        default:              navigate('/not-found',     { replace: true })
      }
    } catch (err) {
      const { message, fields } = toUiError(err)
      setTopError(message)
      if (fields) setFormErrors(fields) // { username: ['...'], password: ['...'] }
    }
  }

  return (
    <div>
      <h2>¡Bienvenidoa latonlla de ling</h2>
      {topError && (
        <div className="mb-3 p-2 rounded bg-red-100 text-red-700">{topError}</div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Usuario</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
           
          />
          {formErrors.username?.map((m, i) => (
            <p key={i} className="text-xs text-red-600 mt-1">{m}</p>
          ))}
        </div>

        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded w-full p-2"
          />
          {formErrors.password?.map((m, i) => (
            <p key={i} className="text-xs text-red-600 mt-1">{m}</p>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white  hover:bg-yellow-500"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}

export default Login
