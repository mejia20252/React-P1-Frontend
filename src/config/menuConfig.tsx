// src/config/menuItems.ts
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHome,faCreditCard, faUsers, faCogs, faBoxOpen,faPhone,
   faShoppingCart, faUserShield,faMoneyBillWave,faCalendarCheck,
   faEnvelopeOpenText,faClipboardList,faClipboardCheck ,
         faTools ,
    faBuilding, faPaw, faCar,faTreeCity ,faBullhorn,faSignOutAlt,faUser,faBell,
    faGear,faShieldAlt,faCalendarAlt,faExclamationTriangle,
    faTasks} from '@fortawesome/free-solid-svg-icons';

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
      title: 'Módulo uu',
      icon: faUsers,
      subItems: [
        { to: '/administrador/usuarios', title: 'Usuarios', icon: faUsers },
        { to: '/administrador/roles', title: 'Roles', icon: faCogs },
        { to: '/administrador/grupos', title: 'Permisos', icon: faUserShield },
        { to: '/administrador/bitacoras', title: 'Bitacoras', icon: faBoxOpen  },
        { to: '/administrador/telefonos', title: 'Telefonos', icon: faPhone  },
        { to: '/administrador/perfiltrabajador', title: 'Perfiles Trabajadores', icon: faUsers  },
        { to: '/administrador/asignacionestarea', title: 'Asignar Tareas', icon: faTasks  },
        { to: '/administrador/incidentes', title: 'Notificaion', icon: faBell  },

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
        { to: '/administrador/asignar-propietario', title: 'Asignar Propietario', icon: faUserShield },
        { to: '/administrador/contratos-arrendamiento', title: 'contratos arerendamiento', icon: faUserShield },
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
  Propietario: [
    { to: '/propietario/dashboard', title: 'DASHBOARD', icon: faHome },
    {
      title: 'Mi Perfil',
      icon: faUser,
      subItems: [
        { to: '/propietario/perfil', title: 'Datos Personales', icon: faUser },
        { to: '/propietario/mis-propiedades', title: 'Mi Residencia', icon: faBuilding },
        { to: '/propietario/telefonos', title: 'Mis Teléfonos', icon: faPhone },
        { to: '/propietario/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
        { title: 'Cerrar sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
    {
      title: 'Finanzas',
      icon: faMoneyBillWave,
      subItems: [
        { to: '/propietario/cuotas', title: 'Mis Cuotas', icon: faCreditCard },
        { to: '/propietario/pagos', title: 'Historial de Pagos', icon: faClipboardList },
      ],
    },
    {
      title: 'Comunicación',
      icon: faBullhorn,
      subItems: [
        { to: '/propietario/comunicados', title: 'Avisos y Comunicados', icon: faEnvelopeOpenText },
      ],
    },
    {
      title: 'Áreas Comunes',
      icon: faTreeCity,
      subItems: [
        { to: '/propietario/areas-comunes', title: 'Ver Áreas Comunes', icon: faTreeCity },
        { to: '/propietario/reservas', title: 'Mis Reservas', icon: faCalendarCheck },
        // { to: '/propietario/hacer-reserva', title: 'Hacer Nueva Reserva', icon: faShoppingCart }, // Integrar en 'Ver Áreas Comunes'
      ],
    },
    {
      title: 'Seguridad y Bienes',
      icon: faShieldAlt,
      subItems: [
        { to: '/propietario/vehiculos', title: 'Mis Vehículos', icon: faCar },
        { to: '/propietario/mascotas', title: 'Mis Mascotas', icon: faPaw },
      ],
    },
  ],
  Inquilino: [
    { to: '/inquilino/dashboard', title: 'DASHBOARD', icon: faHome },
    {
      title: 'Mi Perfil',
      icon: faUser,
      subItems: [
        { to: '/inquilino/perfil', title: 'Datos Personales', icon: faUser },
        { to: '/inquilino/casas', title: 'Ver Casa', icon: faBuilding }, // Para ver detalles de la casa que habita
        { to: '/inquilino/telefonos', title: 'Mis Teléfonos', icon: faPhone },
        { to: '/inquilino/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
        { title: 'Cerrar sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
    {
      title: 'Finanzas',
      icon: faMoneyBillWave,
      subItems: [
        { to: '/inquilino/cuotas', title: 'Mis Cuotas y Pagos', icon: faCreditCard }, // Para consulta y pago
        { to: '/inquilino/pagos', title: 'Historial de Pagos', icon: faClipboardList },
      ],
    },
    {
      title: 'Comunicación',
      icon: faBullhorn,
      subItems: [
        { to: '/inquilino/comunicados', title: 'Avisos y Comunicados', icon: faEnvelopeOpenText },
        { to: '/inquilino/notificaciones', title: 'Notificaciones IA', icon: faBell }, // Para notificaciones Push
      ],
    },
    {
      title: 'Áreas Comunes',
      icon: faTreeCity,
      subItems: [
        { to: '/inquilino/areas-comunes', title: 'Ver Áreas Comunes', icon: faTreeCity },
        { to: '/inquilino/reservas', title: 'Mis Reservas', icon: faCalendarCheck },
      ],
    },
     {
      title: 'Seguridad y Bienes',
      icon: faShieldAlt,
      subItems: [
        { to: '/inquilino/vehiculos', title: 'Mis Vehículos', icon: faCar },
        { to: '/inquilino/mascotas', title: 'Mis Mascotas', icon: faPaw },
      ],
    },
  ],
   Seguridad: [
    { to: '/seguridad/dashboard', title: 'DASHBOARD', icon: faHome },
    {
      title: 'Mi Perfil',
      icon: faUser,
      subItems: [
        { to: '/seguridad/perfil', title: 'Datos Personales', icon: faUser },
        { to: '/seguridad/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
        { title: 'Cerrar sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
    {
      title: 'Control de Acceso',
      icon: faShieldAlt,
      subItems: [
        { to: '/seguridad/registro-accesos', title: 'Registrar Acceso', icon: faBoxOpen },
        { to: '/seguridad/historial-accesos', title: 'Historial de Acceso', icon: faClipboardList },
        { to: '/seguridad/gestion-residentes', title: 'Gestión de Residentes', icon: faUsers },
        { to: '/seguridad/gestion-vehiculos', title: 'Gestión de Vehículos', icon: faCar },
      ],
    },
    {
      title: 'Incidentes y Novedades',
      icon: faExclamationTriangle,
      subItems: [
        { to: '/seguridad/reportar-incidente', title: 'Reportar Incidente', icon: faExclamationTriangle },
        { to: '/seguridad/ver-incidentes', title: 'Ver Incidentes', icon: faBell },
        { to: '/seguridad/comunicados', title: 'Comunicados Internos', icon: faBullhorn },
      ],
    },
  ],
  Trabajador: [
    { to: '/trabajador/dashboard', title: 'DASHBOARD', icon: faHome },
    {
      title: 'Mi Perfil',
      icon: faUser,
      subItems: [
        { to: '/trabajador/perfil', title: 'Datos Personales', icon: faUser },
        { to: '/trabajador/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
        { title: 'Cerrar sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
    {
      title: 'Mis Tareas',
      icon: faTasks,
      subItems: [
        { to: '/trabajador/tareas-asignadas', title: 'Tareas Asignadas', icon: faClipboardCheck },
        { to: '/trabajador/reporte-tareas', title: 'Reporte de Tareas', icon: faTools },
      ],
    },
    {
      title: 'Horarios y Calendario',
      icon: faCalendarAlt,
      subItems: [
        { to: '/trabajador/mi-horario', title: 'Mi Horario', icon: faCalendarAlt },
        { to: '/trabajador/solicitud-vacaciones', title: 'Solicitar Vacaciones', icon: faCalendarCheck },
      ],
    },
    {
      title: 'Comunicación',
      icon: faBullhorn,
      subItems: [
        { to: '/trabajador/comunicados', title: 'Avisos y Comunicados', icon: faEnvelopeOpenText },
      ],
    },
  ],
 
};