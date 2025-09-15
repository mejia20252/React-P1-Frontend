import * as yup from 'yup';

export const inquilinoSchema = yup.object({
  usuario: yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    username: yup.string().required('El nombre de usuario es requerido'),
    apellido_paterno: yup.string().required('El apellido paterno es requerido'),
    apellido_materno: yup.string().required('El apellido materno es requerido'),
    sexo: yup.string().nullable(),
    email: yup.string().email('Email inválido').required('El email es requerido'),
    password: yup
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .when('$isCreating', {
        is: true,
        then: (schema) => schema.required('La contraseña es requerida'),
        otherwise: (schema) => schema.notRequired(), // ← ¡Aquí está la magia!
      }),
  }).required(),
  fecha_inicio_contrato: yup.string().required('La fecha de inicio es requerida'),
  fecha_fin_contrato: yup
    .string()
    .required('La fecha de fin es requerida')
    .test(
      'es-posterior',
      'La fecha de fin debe ser posterior a la de inicio',
      function (value) {
        const { fecha_inicio_contrato } = this.parent;
        return !fecha_inicio_contrato || !value || new Date(value) > new Date(fecha_inicio_contrato);
      }
    ),
});