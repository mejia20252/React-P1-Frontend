// src/components/incidentes/CrearIncidenteForm.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // 👈 Importamos useNavigate
import api from '../../../app/axiosInstance'
import { toast } from 'react-toastify'

const TIPOS_INCIDENTE = [
  { value: 'acceso_no_autorizado', label: 'Acceso No Autorizado' },
  { value: 'persona_desconocida', label: 'Persona Desconocida en Área Restringida' },
  { value: 'vehiculo_mal_estacionado', label: 'Vehículo Mal Estacionado' },
  { value: 'perro_suelto', label: 'Perro Suelto' },
  { value: 'perro_haciendo_necesidades', label: 'Perro Haciendo Necesidades' },
]

export default function IncidenteForm() {
  const navigate = useNavigate() // 👈 Hook para redirigir

  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    ubicacion: '',
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors && errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return Object.keys(newErrors).length > 0 ? newErrors : null
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors(null)

    try {
      await api.post('/incidentes/', formData)
      toast.success('✅ Incidente registrado y notificaciones enviadas.')

      // 👇 Redirigir a la lista de incidentes tras éxito
      navigate('/administrador/incidentes')

    } catch (error: any) {
      const uiError = error.response?.data
      if (uiError && typeof uiError === 'object') {
        setErrors(uiError)
        toast.error('⚠️ Corrige los errores del formulario.')
      } else {
        toast.error('❌ Error al registrar el incidente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nuevo Incidente de Seguridad</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Incidente */}
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Incidente *
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona un tipo</option>
            {TIPOS_INCIDENTE.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors?.tipo && (
            <p className="mt-1 text-sm text-red-600">{errors.tipo.join(', ')}</p>
          )}
        </div>

        {/* Ubicación */}
        <div>
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación (Ej: Entrada Principal, Torre A, Piscina) *
          </label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Estacionamiento Subterráneo B2"
            required
          />
          {errors?.ubicacion && (
            <p className="mt-1 text-sm text-red-600">{errors.ubicacion.join(', ')}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción Detallada *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe lo ocurrido, características de la persona/vehículo, hora aproximada, etc."
            required
          />
          {errors?.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion.join(', ')}</p>
          )}
        </div>

        {/* Botones */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-md font-medium text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {loading ? 'Enviando...' : '✅ Registrar Incidente y Enviar Notificaciones'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/administrador/incidentes')}
            className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            ← Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}