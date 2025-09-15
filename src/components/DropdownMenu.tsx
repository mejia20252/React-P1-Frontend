// src/components/Sidebar/DropdownMenu.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faChevronDown, faChevronUp, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { type MenuItem } from '../config/menuConfig';

interface DropdownMenuProps {
  item: MenuItem;
  onItemClick: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ item, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const arrowIcon = isOpen ? faChevronUp : faChevronDown;

  return (
    <>
      <a
        href="#" // Use href="#" for a non-navigational link
        onClick={toggleDropdown}
        className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 transition-colors duration-300 ease-in-out rounded-lg mx-2 hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={item.icon || faQuestionCircle} className="mr-3" />
        {item.title}
        <FontAwesomeIcon icon={arrowIcon} className="ml-auto" />
      </a>
      {isOpen && (
        <ul className="pl-8 mt-2 space-y-1 transition-all duration-300 ease-in-out overflow-hidden">
          {item.subItems?.map((subItem) => (
            <li key={subItem.to} className="py-1">
              <NavLink
                to={subItem.to || '#'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-xs font-medium transition-colors duration-300 ease-in-out rounded-lg
                  ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`
                }
                onClick={onItemClick}
              >
                <FontAwesomeIcon icon={subItem.icon || faQuestionCircle} className="mr-3 w-4" />
                {subItem.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default DropdownMenu;