export  interface Producto {
  id: number;
  nombre: string;
}
export  interface Inventario {
  id: number;
  producto: number;
  precio: number;
  stock: number;
}
export  interface Rol {
  id: number;
  nombre: string;
}
export  interface CustomUser {
  id: number;
  username: string;
  rol?: Rol | null;
}
export  interface Venta {
  id: number;
  total: number;
  impuesto: number;
  descuento: number;
  subtotal: number;
  cliente: CustomUser;
  cajero: CustomUser;
}
export  interface DetalleVenta {
  id: number;
  venta: Venta;
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}
export  type EstadoPedido = 'PENDIENTE' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO';

export  interface Pedido {
  id: number;
  estado: EstadoPedido;
  fecha: string; // ISO 8601 string
  total: number;
  direccion: string;
  detallepedidos:DetallePedido;
}
export  interface DetallePedido {
  id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}
export  interface Factura {
  id: number;
  fecha: string;
  total: number;
  forma_pago: string;
  pedido: Pedido;
}
export  interface Reporte {
  id: number;
  fecha_generada: string;
  tipo: string;
  parametro?: string;
  cajero: CustomUser;
}
export  interface Bitacora {
  id: number;
  login: string;
  logout?: string | null;
  usuario: number;
  ip?: string | null;
  device?: string | null;
}
export  interface DetalleBitacora {
  id: number;
  bitacora: number;
  accion: string;
  fecha: string;
  tabla: string;
}
export type CreateUserDto = {
  username: string
  password: string
  rol: number | null
}

export type UpdateUserDto = {
  username?: string
  password: string
  rol?: number | null
}
