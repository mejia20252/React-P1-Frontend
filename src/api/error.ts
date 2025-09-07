// src/api/error.ts
import type { AxiosError } from 'axios'

type UiError = {
  message: string      // texto para mostrar al usuario
  fields?: Record<string, string[]> // errores por campo (validación)
  status?: number      // código HTTP si existe
}


export function toUiError(err: unknown): UiError {
  const ax = err as AxiosError<any>
  if (ax?.response) {
    const { status, data } = ax.response
    if (data?.error) {
      return {
        message: data.error.message || 'Ocurrió un error',
        fields: data.error.fields,
        status
      }
    }
    if (data?.detail) return { message: data.detail, status }
    return { message: 'Error de validación', fields: data, status }
  }
  if (ax?.request) return { message: 'No hay conexión con el servidor' }
  return { message: (ax as any)?.message || 'Error desconocido' }
} 
