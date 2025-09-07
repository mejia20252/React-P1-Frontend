
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { menuItemsByRole } from '../../config/menuConfig';

const Sidebar: React.FC = () => {
  const { user, signout } = useAuth();
  const role = user?.rol?.nombre;
  const back = useNavigate();

  const menuItems = role && menuItemsByRole[role as keyof typeof menuItemsByRole] || [];

  const [isOpen, setIsOpen] = useState(true); // Estado de visibilidad

  return (
    <>
      {/* Botón para abrir/cerrar el sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-red-600 text-white p-2 rounded hover:bg-red-700"
      >
        {isOpen ? '✖' : '☰'} {/* Iconos de cerrar y hamburguesa */}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-red-800 text-white w-64 h-screen flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-4 text-xl font-bold">Home</div>
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
              }
              onClick={() => setIsOpen(false)} // Se cierra al dar click en un link
            >
             
            </NavLink>
          ))}
        </nav>
        <NavLink
          to={'/perfil'}  className="block px-4 py-2 hover:bg-gray-700">
          Perfil
        </NavLink>
        <button
          onClick={() => {
            signout();
            back('/login');
          }}
          className="m-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default Sidebar;
