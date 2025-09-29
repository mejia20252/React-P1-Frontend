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
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopError('');
    setFormErrors({});

    if (isLoading) return; // Prevenir múltiples envíos

    setIsLoading(true);

    try {
      if (user) await signout();

      const me = await signin(username, password);

      if (!me.rol) {
        navigate('/unauthorized', { replace: true });
        return;
      }

      switch (me.rol?.nombre) {
        case 'Administrador':
          navigate('/administrador', { replace: true });
          break;
        case 'Propietario':
          navigate('/propietario', { replace: true });
          break;
          case 'Inquilino':
          navigate('/inquilino', { replace: true });
          break;
             case 'Seguridad':
          navigate('/seguridad', { replace: true });
          break;
             case 'Trabajador':
          navigate('/trabajador', { replace: true });
          break;
       
        default:
          navigate('/unauthorized', { replace: true });
      }
    } catch (err) {
      const { message, fields } = toUiError(err);
      setTopError(message);
      if (fields) setFormErrors(fields);
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            {formErrors.password?.map((m, i) => (
              <p key={i} className="text-red-600 text-xs mt-1">
                {m}
              </p>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-2.5 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Iniciando sesión.....
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;