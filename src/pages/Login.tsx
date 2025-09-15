// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toUiError } from '../api/error';

const Login: React.FC = () => {
  const { signin, user, signout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [topError, setTopError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopError('');
    setFormErrors({});

    try {
      if (user) await signout();

      const me = await signin(username, password);
      // Verificar si rol es null o undefined
      console.log('este es e usuar', me);

      if (!me.rol) {
      console.log('si entreaaqu');

        navigate('/unauthorized', { replace: true });
        return; // Salir de la función para evitar continuar
      }
      switch (me.rol?.nombre) {
        case 'Administrador':
          navigate('/administrador', { replace: true });
          break;
        case 'Personal':
          navigate('/personal', { replace: true });
          break;
        case 'Cliente':
          navigate('/cliente', { replace: true });
          break;
        case 'Inquilino':
          navigate('/cliente', { replace: true });
          break;
        default:
          navigate('/unauthorized', { replace: true });
      }
    } catch (err) {
      const { message, fields } = toUiError(err);
      setTopError(message);
      if (fields) setFormErrors(fields);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Iniciar Sesión
        </h2>
        {topError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center">
            {topError}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              placeholder="Ingresa tu usuario"
            />
            {formErrors.username?.map((m, i) => (
              <p key={i} className="text-red-600 text-xs mt-1">
                {m}
              </p>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              placeholder="Ingresa tu contraseña"
            />
            {formErrors.password?.map((m, i) => (
              <p key={i} className="text-red-600 text-xs mt-1">
                {m}
              </p>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;