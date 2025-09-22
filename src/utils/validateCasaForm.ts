// src/utils/validateCasaForm.ts

import type { CasaFormData } from '../types/type-casa-v1';

export interface ValidationError {
  field: keyof CasaFormData;
  message: string;
}

export const validateCasaForm = (data: CasaFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // numero_casa: required, max 10 chars
  if (!data.numero_casa.trim()) {
    errors.push({ field: 'numero_casa', message: 'El número de casa es obligatorio' });
  } else if (data.numero_casa.length > 10) {
    errors.push({ field: 'numero_casa', message: 'Máximo 10 caracteres' });
  }

  // tipo_de_unidad: required
  if (!data.tipo_de_unidad.trim()) {
    errors.push({ field: 'tipo_de_unidad', message: 'El tipo de unidad es obligatorio' });
  }

  // numero: required, integer, positive
  if (!Number.isInteger(data.numero) || data.numero <= 0) {
    errors.push({ field: 'numero', message: 'El número debe ser un entero positivo' });
  }

  // area: required, string, valid decimal format, > 0
  if (!data.area) {
    errors.push({ field: 'area', message: 'El área es obligatoria' });
  } else {
    const areaRegex = /^\d+(\.\d{1,2})?$/;
    if (!areaRegex.test(data.area)) {
      errors.push({ field: 'area', message: 'El área debe ser un número válido con hasta 2 decimales' });
    } else if (parseFloat(data.area) <= 0) {
      errors.push({ field: 'area', message: 'El área debe ser mayor que 0' });
    }
  }

  // estado_ocupacion: required, must be one of the choices
  const validEstados = ['ocupada', 'desocupada', 'en_mantenimiento', 'suspendida'];
  if (!validEstados.includes(data.estado_ocupacion)) {
    errors.push({ field: 'estado_ocupacion', message: 'Estado de ocupación inválido' });
  }

  // tiene_parqueo_asignado: required boolean
  if (typeof data.tiene_parqueo_asignado !== 'boolean') {
    errors.push({ field: 'tiene_parqueo_asignado', message: 'Debe ser verdadero o falso' });
  }

  // piso: optional, but if present, must be positive integer
  if (data.piso !== undefined && data.piso !== null) {
    if (!Number.isInteger(data.piso) || data.piso <= 0) {
      errors.push({ field: 'piso', message: 'El piso debe ser un entero positivo' });
    }
  }

  // torre_o_bloque: optional, max 50 chars
  if (data.torre_o_bloque && data.torre_o_bloque.length > 50) {
    errors.push({ field: 'torre_o_bloque', message: 'Máximo 50 caracteres' });
  }

  // numero_parqueo: optional, max 20 chars
  if (data.numero_parqueo && data.numero_parqueo.length > 20) {
    errors.push({ field: 'numero_parqueo', message: 'Máximo 20 caracteres' });
  }

  // observaciones: no length validation needed (TextField)

  return errors;
};