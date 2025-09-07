// src/config/menuItems.ts
import { FaShoppingCart } from 'react-icons/fa'

export interface MenuItem {
  to: string
  label: string
  icon?: React.ReactNode
}
export const menuItemsByRole: Record<string, MenuItem[]> = {
 
  Administrador: [
    { to: '/administrador/dashboard', label: 'DASHBOARD' },
    { to: '/administrador/usuarios', label: 'USUARIOS' },
    { to: '/administrador/roles', label: 'Roles' },
    { to: '/administrador/bitacoras', label: 'Bitácoras' },
    { to: '/administrador/productos', label: 'productos' },
    { to: '/administrador/inventarios', label: 'Inventarios' },

    //{ to: '/administrador/ventas', label: 'Préstamos' },
    //{ to: '/administrador/detalle-ventas', label: 'Detalle de Ventas' },
    //{ to: '/administrador/bitacora-detalles', label: 'Bitácora Detallada' },

    //{ to: '/administrador/pedidos', label: 'Pedidos' },
    //{ to: '/administrador/detalle-pedidos', label: 'Detalle de Pedidos' },
    //{ to: '/administrador/facturas', label: 'Facturas' },
    //{ to: '/administrador/reportes', label: 'Reportes' },
    //{ to: '/administrador/detalle-bitacoras', label: 'Detalle de Bitácoras' },
  ],

  Cliente: [
    { to: '/cliente/dashboard', label: 'Dashboard' },
    { to: '/cliente/productos', label: 'Catálogo' },
     {
      to: '/cliente/cart',
      label: 'Carrito',
      icon: <FaShoppingCart className="inline mr-2" />
    },
  ],

  Cajero: [
    { to: '/cajero/dashboard', label: 'Dashboard' },
    { to: '/cajero/books', label: 'Libros' },
    { to: '/cajero/my-loans', label: 'Mis Préstamos' },
  ],

  Repartidor: [
    { to: '/repartidor/dashboard', label: 'Dashboard' },
    { to: '/repartidor/books', label: 'Libros' },
    { to: '/repartidor/my-loans', label: 'Mis Préstamos' },
  ],
};
