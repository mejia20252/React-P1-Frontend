// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { menuItemsByRole  } from '../../config/menuConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes,faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import DropdownMenu from '../DropdownMenu'; // Import the new component

const Sidebar: React.FC = () => {
  const { user } = useAuth(); // Ya no necesitamos 'signout' ni 'navigate' aquí directamente
  const role = user?.rol?.nombre;
  // const navigate = useNavigate(); // Ya no necesitamos 'navigate' aquí

  const menuItems = role && menuItemsByRole[role as keyof typeof menuItemsByRole] || [];

  const [isOpen, setIsOpen] = useState(false);

  // Eliminamos handleSignout de aquí porque ahora se maneja en DropdownMenu

  const handleItemClick = () => {
    setIsOpen(false);
  };

  const menuIcon = isOpen ? faTimes : faBars;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-gray-800 transition-colors duration-300 md:hidden focus:outline-none"
      >
        <FontAwesomeIcon icon={menuIcon} size="lg" />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full flex flex-col transition-transform duration-300 ease-in-out bg-white shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-64`}
      >
        <div className="flex items-center justify-between p-6">
          <h1 className="text-xl font-extrabold text-gray-800">Smart Condominium</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-600 transition-colors duration-300 rounded-full hover:bg-gray-100 md:hidden focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {menuItems.map((item) => (
              <li key={item.title} className="py-1">
                {item.subItems ? (
                  // Pasamos la misma función handleItemClick al DropdownMenu
                  <DropdownMenu item={item} onItemClick={handleItemClick} />
                ) : (
                  // Si no tiene subItems, es un NavLink directo
                  <NavLink
                    to={item.to || '#'}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 text-sm font-medium transition-colors duration-300 ease-in-out rounded-lg mx-2
                      ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`
                    }
                    onClick={() => handleItemClick()} // Llama a handleItemClick
                  >
                    <FontAwesomeIcon icon={item.icon || faQuestionCircle} className="mr-3" />
                    {item.title}
                  </NavLink>
                )}
              </li>
            ))}
 
          </ul>
        </nav>
        {/* *** ELIMINAMOS EL BOTÓN DE CERRAR SESIÓN DE AQUÍ *** */}
        {/* <div className="p-4">
          <button
            onClick={handleSignout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-300 ease-in-out bg-gray-800 rounded-md shadow-md hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Cerrar sesión
          </button>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;