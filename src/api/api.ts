// src/api/api.ts
import axios from '../app/axiosInstance'

import type {
  Producto, Inventario, Rol, CustomUser,
  Venta, DetalleVenta, Pedido, DetallePedido,
  Factura, Reporte, Bitacora, UpdateUserDto,DetalleBitacora,CreateUserDto
} from '../types'


export function createUsuario(dto: CreateUserDto) {
  return axios.post('/usuarios/', dto)
}

/** 1. PRODUCTO */
export interface ProductoDto {
  nombre: string
}
export const fetchProductos = async (): Promise<Producto[]> => {
  const { data } = await axios.get<Producto[]>('/productos/')
  return data
}
export const fetchProducto = async (id: number): Promise<Producto> => {
  const { data } = await axios.get<Producto>(`/productos/${id}/`)
  return data
}
export const createProducto = async (p: ProductoDto): Promise<Producto> => {
  const { data } = await axios.post<Producto>('/productos/', p)
  return data
}
export const updateProducto = async (id: number, p: ProductoDto): Promise<Producto> => {
  const { data } = await axios.put<Producto>(`/productos/${id}/`, p)
  return data
}
export const partialUpdateProducto = async (id: number, patch: Partial<ProductoDto>): Promise<Producto> => {
  const { data } = await axios.patch<Producto>(`/productos/${id}/`, patch)
  return data
}
export const deleteProducto = async (id: number): Promise<void> => {
  await axios.delete(`/productos/${id}/`)
}

/** 2. INVENTARIO */
export interface InventarioDto {
  producto: number   // id del producto
  precio: number
  stock: number
}
export const fetchInventarios = async (): Promise<Inventario[]> => {
  const { data } = await axios.get<Inventario[]>('/inventarios/')
  return data
}
export const fetchInventario = async (id: number): Promise<Inventario> => {
  const { data } = await axios.get<Inventario>(`/inventarios/${id}/`)
  return data
}
export const createInventario = async (i: InventarioDto): Promise<Inventario> => {
  const { data } = await axios.post<Inventario>('/inventarios/', i)
  return data
}
export const updateInventario = async (id: number, i: InventarioDto): Promise<Inventario> => {
  const { data } = await axios.put<Inventario>(`/inventarios/${id}/`, i)
  return data
}
export const partialUpdateInventario = async (id: number, patch: Partial<InventarioDto>): Promise<Inventario> => {
  const { data } = await axios.patch<Inventario>(`/inventarios/${id}/`, patch)
  return data
}
export const deleteInventario = async (id: number): Promise<void> => {
  await axios.delete(`/inventarios/${id}/`)
}

/** 3. ROL */
export interface RolDto {
  nombre: string
}
export const fetchRoles = async (): Promise<Rol[]> => {
  const { data } = await axios.get<Rol[]>('/roles/')
  return data
}
export const fetchRol = async (id: number): Promise<Rol> => {
  const { data } = await axios.get<Rol>(`/roles/${id}/`)
  return data
}
export const createRol = async (r: RolDto): Promise<Rol> => {
  const { data } = await axios.post<Rol>('/roles/', r)
  return data
}
export const updateRol = async (id: number, r: RolDto): Promise<Rol> => {
  const { data } = await axios.put<Rol>(`/roles/${id}/`, r)
  return data
}
export const partialUpdateRol = async (id: number, patch: Partial<RolDto>): Promise<Rol> => {
  const { data } = await axios.patch<Rol>(`/roles/${id}/`, patch)
  return data
}
export const deleteRol = async (id: number): Promise<void> => {
  await axios.delete(`/roles/${id}/`)
}


export const fetchUsuarios = async (): Promise<CustomUser[]> => {
  const { data } = await axios.get<CustomUser[]>('/usuarios/')
  return data
}
export const fetchUsuario = async (id: number): Promise<CustomUser> => {
  const { data } = await axios.get<CustomUser>(`/usuarios/${id}/`)
  return data
}

export const updateUsuario = async (id: number, u: UpdateUserDto): Promise<CustomUser> => {
  const { data } = await axios.put<CustomUser>(`/usuarios/${id}/`, u)
  return data
}
export const partialUpdateUsuario = async (id: number, patch: Partial<UpdateUserDto>): Promise<CustomUser> => {
  const { data } = await axios.patch<CustomUser>(`/usuarios/${id}/`, patch)
  return data
}
export const deleteUsuario = async (id: number): Promise<void> => {
  await axios.delete(`/usuarios/${id}/`)
}

/** 5. VENTA */
export interface VentaDto {
  total: number
  impuesto: number
  descuento: number
  subtotal: number
  cliente: number
  cajero: number
}
export const fetchVentas = async (): Promise<Venta[]> => {
  const { data } = await axios.get<Venta[]>('/ventas/')
  return data
}
export const fetchVenta = async (id: number): Promise<Venta> => {
  const { data } = await axios.get<Venta>(`/ventas/${id}/`)
  return data
}
export const createVenta = async (v: VentaDto): Promise<Venta> => {
  const { data } = await axios.post<Venta>('/ventas/', v)
  return data
}
export const updateVenta = async (id: number, v: VentaDto): Promise<Venta> => {
  const { data } = await axios.put<Venta>(`/ventas/${id}/`, v)
  return data
}
export const partialUpdateVenta = async (id: number, patch: Partial<VentaDto>): Promise<Venta> => {
  const { data } = await axios.patch<Venta>(`/ventas/${id}/`, patch)
  return data
}
export const deleteVenta = async (id: number): Promise<void> => {
  await axios.delete(`/ventas/${id}/`)
}

/** 6. DETALLE VENTA */
export interface DetalleVentaDto {
  venta: number
  producto: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}
export const fetchDetalleVentas = async (): Promise<DetalleVenta[]> => {
  const { data } = await axios.get<DetalleVenta[]>('/detalle-ventas/')
  return data
}
export const fetchDetalleVenta = async (id: number): Promise<DetalleVenta> => {
  const { data } = await axios.get<DetalleVenta>(`/detalle-ventas/${id}/`)
  return data
}
export const createDetalleVenta = async (d: DetalleVentaDto): Promise<DetalleVenta> => {
  const { data } = await axios.post<DetalleVenta>('/detalle-ventas/', d)
  return data
}
export const updateDetalleVenta = async (id: number, d: DetalleVentaDto): Promise<DetalleVenta> => {
  const { data } = await axios.put<DetalleVenta>(`/detalle-ventas/${id}/`, d)
  return data
}
export const partialUpdateDetalleVenta = async (id: number, patch: Partial<DetalleVentaDto>): Promise<DetalleVenta> => {
  const { data } = await axios.patch<DetalleVenta>(`/detalle-ventas/${id}/`, patch)
  return data
}
export const deleteDetalleVenta = async (id: number): Promise<void> => {
  await axios.delete(`/detalle-ventas/${id}/`)
}
export interface DetallePedidoDto {
  producto: number        // id del producto
  cantidad: number
  precio_unitario: number
  subtotal: number
}
/** 7. PEDIDO */
export interface PedidoDto {
  fecha: string
  total: number
  direccion: string
  detallepedidos:DetallePedidoDto[]
}
export const fetchPedidos = async (): Promise<Pedido[]> => {
  const { data } = await axios.get<Pedido[]>('/pedidos/')
  return data
}
export const fetchPedido = async (id: number): Promise<Pedido> => {
  const { data } = await axios.get<Pedido>(`/pedidos/${id}/`)
  return data
}
export const createPedido = async (p: PedidoDto): Promise<Pedido> => {
  const { data } = await axios.post<Pedido>('/pedidos/', p)
  return data
}
export const updatePedido = async (id: number, p: PedidoDto): Promise<Pedido> => {
  const { data } = await axios.put<Pedido>(`/pedidos/${id}/`, p)
  return data
}
export const partialUpdatePedido = async (id: number, patch: Partial<PedidoDto>): Promise<Pedido> => {
  const { data } = await axios.patch<Pedido>(`/pedidos/${id}/`, patch)
  return data
}
export const deletePedido = async (id: number): Promise<void> => {
  await axios.delete(`/pedidos/${id}/`)
}

/** 8. DETALLE PEDIDO */
export interface DetallePedidoDto {
  producto: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}
export const fetchDetallePedidos = async (): Promise<DetallePedido[]> => {
  const { data } = await axios.get<DetallePedido[]>('/detalle-pedidos/')
  return data
}
export const fetchDetallePedido = async (id: number): Promise<DetallePedido> => {
  const { data } = await axios.get<DetallePedido>(`/detalle-pedidos/${id}/`)
  return data
}
export const createDetallePedido = async (d: DetallePedidoDto): Promise<DetallePedido> => {
  const { data } = await axios.post<DetallePedido>('/detalle-pedidos/', d)
  return data
}
export const updateDetallePedido = async (id: number, d: DetallePedidoDto): Promise<DetallePedido> => {
  const { data } = await axios.put<DetallePedido>(`/detalle-pedidos/${id}/`, d)
  return data
}
export const partialUpdateDetallePedido = async (id: number, patch: Partial<DetallePedidoDto>): Promise<DetallePedido> => {
  const { data } = await axios.patch<DetallePedido>(`/detalle-pedidos/${id}/`, patch)
  return data
}
export const deleteDetallePedido = async (id: number): Promise<void> => {
  await axios.delete(`/detalle-pedidos/${id}/`)
}

/** 9. FACTURA */
export interface FacturaDto {
  fecha: string
  total: number
  forma_pago: string
  pedido: number
}
export const fetchFacturas = async (): Promise<Factura[]> => {
  const { data } = await axios.get<Factura[]>('/facturas/')
  return data
}
export const fetchFactura = async (id: number): Promise<Factura> => {
  const { data } = await axios.get<Factura>(`/facturas/${id}/`)
  return data
}
export const createFactura = async (f: FacturaDto): Promise<Factura> => {
  const { data } = await axios.post<Factura>('/facturas/', f)
  return data
}
export const updateFactura = async (id: number, f: FacturaDto): Promise<Factura> => {
  const { data } = await axios.put<Factura>(`/facturas/${id}/`, f)
  return data
}
export const partialUpdateFactura = async (id: number, patch: Partial<FacturaDto>): Promise<Factura> => {
  const { data } = await axios.patch<Factura>(`/facturas/${id}/`, patch)
  return data
}

export const deleteFactura = async (id: number): Promise<void> => {
  await axios.delete(`/facturas/${id}/`)
}

/** 10. REPORTE */
export interface ReporteDto {
  fecha_generada: string
  tipo: string
  parametro?: string
  cajero: number
}
export const fetchReportes = async (): Promise<Reporte[]> => {
  const { data } = await axios.get<Reporte[]>('/reportes/')
  return data
}
export const fetchReporte = async (id: number): Promise<Reporte> => {
  const { data } = await axios.get<Reporte>(`/reportes/${id}/`)
  return data
}
export const createReporte = async (r: ReporteDto): Promise<Reporte> => {
  const { data } = await axios.post<Reporte>('/reportes/', r)
  return data
}
export const updateReporte = async (id: number, r: ReporteDto): Promise<Reporte> => {
  const { data } = await axios.put<Reporte>(`/reportes/${id}/`, r)
  return data
}
export const partialUpdateReporte = async (id: number, patch: Partial<ReporteDto>): Promise<Reporte> => {
  const { data } = await axios.patch<Reporte>(`/reportes/${id}/`, patch)
  return data
}
export const deleteReporte = async (id: number): Promise<void> => {
  await axios.delete(`/reportes/${id}/`)
}

/** 11. BITACORA */
export interface BitacoraDto {
  login: string
  logout?: string | null
  usuario: number
  ip?: string
  device?: string
}
export const fetchBitacoras = async (): Promise<Bitacora[]> => {
  const { data } = await axios.get<Bitacora[]>('/bitacoras/')
  return data
}
export const fetchBitacora = async (id: number): Promise<Bitacora> => {
  const { data } = await axios.get<Bitacora>(`/bitacoras/${id}/`)
  return data
}
export const createBitacora = async (b: BitacoraDto): Promise<Bitacora> => {
  const { data } = await axios.post<Bitacora>('/bitacoras/', b)
  return data
}
export const updateBitacora = async (id: number, b: BitacoraDto): Promise<Bitacora> => {
  const { data } = await axios.put<Bitacora>(`/bitacoras/${id}/`, b)
  return data
}
export const partialUpdateBitacora = async (id: number, patch: Partial<BitacoraDto>): Promise<Bitacora> => {
  const { data } = await axios.patch<Bitacora>(`/bitacoras/${id}/`, patch)
  return data
}
export const deleteBitacora = async (id: number): Promise<void> => {
  await axios.delete(`/bitacoras/${id}/`)
}

/** 12. DETALLE BITACORA */
export interface DetalleBitacoraDto {
  bitacora: number
  accion: string
  fecha: string
  tabla: string
}
export const fetchDetalleBitacoras = async (): Promise<DetalleBitacora[]> => {
  const { data } = await axios.get<DetalleBitacora[]>('/detalle-bitacoras/')
  return data
}
export const fetchDetalleBitacora = async (id: number): Promise<DetalleBitacora> => {
  const { data } = await axios.get<DetalleBitacora>(`/detalle-bitacoras/${id}/`)
  return data
}
export const createDetalleBitacora = async (d: DetalleBitacoraDto): Promise<DetalleBitacora> => {
  const { data } = await axios.post<DetalleBitacora>('/detalle-bitacoras/', d)
  return data
}
export const updateDetalleBitacora = async (id: number, d: DetalleBitacoraDto): Promise<DetalleBitacora> => {
  const { data } = await axios.put<DetalleBitacora>(`/detalle-bitacoras/${id}/`, d)
  return data
}
export const partialUpdateDetalleBitacora = async (id: number, patch: Partial<DetalleBitacoraDto>): Promise<DetalleBitacora> => {
  const { data } = await axios.patch<DetalleBitacora>(`/detalle-bitacoras/${id}/`, patch)
  return data
}
export const deleteDetalleBitacora = async (id: number): Promise<void> => {
  await axios.delete(`/detalle-bitacoras/${id}/`)
}
