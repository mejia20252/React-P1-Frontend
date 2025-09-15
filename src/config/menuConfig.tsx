// src/config/menuItems.ts
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUsers, faCogs, faBoxOpen,faPhone,
   faShoppingCart, faUserShield, faBuilding, faPaw, faCar } from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  to?: string; // Make 'to' optional for parent items
  title: string;
  icon?: IconProp;
  subItems?: MenuItem[]; // New property for dropdown items
}

export const menuItemsByRole: Record<string, MenuItem[]> = {
  Administrador: [
    { to: '/administrador/dashboard', title: 'DASHBOARD', icon: faHome },
    {
      title: 'Módulo Usuarios',
      icon: faUsers,
      subItems: [
        { to: '/administrador/usuarios', title: 'Usuarios', icon: faUsers },
        { to: '/administrador/roles', title: 'Roles', icon: faCogs },
        { to: '/administrador/grupos', title: 'Permisos', icon: faUserShield },
        { to: '/administrador/bitacoras', title: 'Bitacoras', icon: faBoxOpen  },
        { to: '/administrador/telefonos', title: 'Telefonos', icon: faPhone  },
      ],
    },
    {
      title: 'Módulo Casas',
      icon: faBuilding,
      subItems: [
        { to: '/administrador/mascotas', title: 'Mascotas', icon: faPaw },
        { to: '/administrador/casas', title: 'Casas', icon: faHome },
        { to: '/administrador/vehiculos', title: 'Vehículos', icon: faCar },
      ],
    },
   
  ],
  Cliente: [
    { to: '/cliente/dashboard', title: 'Dashboard', icon: faHome },
    { to: '/cliente/productos', title: 'Catálogo', icon: faBoxOpen },
    {
      to: '/cliente/cart',
      title: 'Carrito',
      icon: faShoppingCart,
    },
  ],
  // ... (other roles)
};