// src/config/menuItems.ts
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUsers, faCogs, faBoxOpen,faPhone,
   faShoppingCart, faUserShield,faMoneyBillWave,
    faBuilding, faPaw, faCar,faTreeCity ,faBullhorn,faSignOutAlt,faUser,
    faGear} from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  to?: string; // Make 'to' optional for parent items
  title: string;
  icon?: IconProp;
   action?: 'signout'; // Puedes extender esto si tienes más acciones
  subItems?: MenuItem[]; // New property for dropdown items
}

export const menuItemsByRole: Record<string, MenuItem[]> = {
  Administrador: [
    { to: '/administrador/dashboard', title: 'DASHBOARD', icon: faHome },
    {
      title: 'Módulo Seguridad',
      icon: faGear,
      subItems: [
        { title: 'Cerrar sesión', icon: faSignOutAlt, action: 'signout' },
        { to: '/administrador/perfil', title: 'Perfil', icon: faUser },
        { to: '/administrador/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
      ],
    },
    
    {
      title: 'Módulo Usuarios',
      icon: faUsers,
      subItems: [
        { to: '/administrador/usuarios', title: 'Usuarios', icon: faUsers },
        { to: '/administrador/roles', title: 'Roles', icon: faCogs },
        { to: '/administrador/grupos', title: 'Permisos', icon: faUserShield },
        { to: '/administrador/bitacoras', title: 'Bitacoras', icon: faBoxOpen  },
        { to: '/   dministrador/telefonos', title: 'Telefonos', icon: faPhone  },
      ],
    },
    {
      title: 'Módulo Casas',
      icon: faBuilding,
      subItems: [
        { to: '/administrador/mascotas', title: 'Mascotas', icon: faPaw },
        { to: '/administrador/casas', title: 'Casas', icon: faHome },
        { to: '/administrador/vehiculos', title: 'Vehículos', icon: faCar },
        { to: '/administrador/residentes', title: 'Residentes', icon: faUsers },
        { to: '/administrador/comunicados', title: 'Comunicados', icon: faBullhorn  },
        { to: '/administrador/conceptos-pago', title: 'Conceptos-pago', icon: faMoneyBillWave   },
        { to: '/administrador/cuotas', title: 'Cuotas', icon: faMoneyBillWave   },
        { to: '/administrador/pagos', title: 'Pagos', icon: faMoneyBillWave   },
      ],
    },
     {
      title: 'Módulo AreasComunes',
      icon: faBuilding,
      subItems: [
        { to: '/administrador/areas-comunes', title: 'areas Comunes', icon: faTreeCity  },
        { to: '/administrador/reservas', title: 'Reservas', icon: faShoppingCart  },
        { to: '/administrador/tareas-mantenimiento', title: 'Tareas-mantenimiento', icon: faBuilding  },
        { to: '/administrador/pagos', title: 'Pago', icon: faBuilding  },
        
   
      ],
    },
   
  ],
 
  // ... (other roles)
};