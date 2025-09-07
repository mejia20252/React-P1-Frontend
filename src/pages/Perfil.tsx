
// src/pages/Perfil.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import axiosInstance from '../app/axiosInstance';
async function getUsuario(id: number) {
    const { data } = await axiosInstance.get(`/usuarios/${id}/`);
    console.log(data, 'estos son los dato delc blakcie');
}
export default function Perfil() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        getUsuario(3);

    }, [])

    if (loading) {
        return <div className="p-6">Cargando perfil...</div>;
    }

    // Si llegas aquí sin user, puedes mostrar algo o redirigir
    if (!user) {
        return (
            <div className="p-6">
                No hay sesión activa.
                <NavLink to="/login" className="ml-2 text-blue-600 underline">
                    Iniciar sesión
                </NavLink>
            </div>
        );
    }


    return (
        <>
            <button
                className="mb-4 rounded border px-3 py-1"
                onClick={() => navigate(-1)}
            >
                Atrás
            </button>

            <div className="mx-auto max-w-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border p-4 bg-white/40">
                        <h2 className="font-semibold mb-3">Datos</h2>
                        <dl className="space-y-3">
                            <div className="flex items-center justify-between">
                                <dt className="text-neutral-600">ID</dt>
                                <dd className="font-medium">{user.id}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-neutral-600">Username</dt>
                                <dd className="font-medium break-all">{user.username}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-neutral-600">Rol ID</dt>
                                <dd className="font-medium">{user.rol?.id}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-neutral-600">Rol</dt>
                                <dd className="font-medium">{user.rol?.nombre}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <NavLink
                to="/administrador/cambiar-contra"
                className="mt-6 inline-block px-4 py-2 rounded border hover:bg-amber-500"
            >
                Cambiar contraseña
            </NavLink>
        </>
    );
}
