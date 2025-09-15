// src/api/api.ts
import axios from '../app/axiosInstance'

import type {
  Inventario, CustomUser,

  Bitacora, UpdateUserDto,DetalleBitacora,CreateUserDto
} from '../types'


export function createUsuario(dto: CreateUserDto) {
  return axios.post('/usuarios/', dto)
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
