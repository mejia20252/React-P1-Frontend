import React, { useState } from 'react';
import { fetchUsuarios } from '../../../api/api-usuario';

interface Props {
  casaId: number;
  onResidenteAgregado: (residente: any) => void;
}

export default function AsignarResidenteForm({ casaId, onResidenteAgregado }: Props) {
  const [usuarios, setUsuarios] = useState<Array<{ id: number; nombre: string; apellido_paterno: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    usuario_id: '',
    rol_residencia: 'familiar' as 'familiar' | 'propietario' | 'inquilino',
  });

  React.useEffect(() => {
    const cargar = async () => {
      const data = await fetchUsuarios();
      setUsuarios(
        data.filter(u =>
          ['Propietario', 'Inquilino', 'Administrador', 'Personal'].includes(u.rol.nombre)
        ).map(u => ({
          id: u.id,
          nombre: u.nombre,
          apellido_paterno: u.apellido_paterno,
        }))
      );
    };
    cargar();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.usuario_id || !form.rol_residencia) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/casas/${casaId}/asignar-residente/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Error al asignar residente.');

      const data = await response.json();
      onResidenteAgregado(data.residente);
      setForm({ usuario_id: '', rol_residencia: 'familiar' });
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Agregar Residente a esta Casa</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Usuario *</label>
          <select
            name="usuario_id"
            value={form.usuario_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">-- Seleccionar usuario --</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} {u.apellido_paterno}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol de Residencia *</label>
          <select
            name="rol_residencia"
            value={form.rol_residencia}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="familiar">Familiar</option>
            <option value="propietario">Propietario</option>
            <option value="inquilino">Inquilino</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Asignando...' : 'Asignar Residente'}
        </button>
      </form>
    </div>
  );
}