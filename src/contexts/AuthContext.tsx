// src/contexts/AuthContext.tsx
import { useEffect } from 'react';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { type Rol } from '../types/type-rol'
import { login, logoutAPI, setEncabezado } from '../api/auth';
import axiosInstance from '../app/axiosInstance';
interface CustomUser {
    id: number;
    username: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    direccion: string | null;
    fecha_nacimiento: string | null;
    rol: Rol;
    sexo?: string | null;
    tipo_personal?: string | null;
    fecha_ingreso?: string | null;
    salario?: number | null;
    fecha_certificacion?: string | null;
    empresa?: string | null;
}

interface AuthContextType {
    user: CustomUser | null;
    signin: (u: string, p: string) => Promise<CustomUser>;
    signout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const signin = async (username: string, password: string): Promise<CustomUser> => {
        // 1) Obtén tokens
        const { access, refresh } = await login(username, password);
        setEncabezado(access);
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        // 2) Recupera datos completos del usuario (incluye role.name)
        const { data: me } = await axiosInstance.get<CustomUser>('/usuarios/me/');

        // 3) Guarda en contexto y devuélvelo
        setUser(me);
        return me;
    };
    useEffect(() => {
        const token = localStorage.getItem('access');
    
        if (!token) {
            setLoading(false);
            return;
        }
        setEncabezado(token);
        axiosInstance
            .get<CustomUser>('/usuarios/me/')
            .then(({ data }) => setUser(data))
            .catch(() => {
                localStorage.removeItem('access');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);



    // Función asíncrona para cerrar sesión
    const signout = async () => {
        // Obtener el token de refresh almacenado localmente
        const refresh = localStorage.getItem('refresh');

        // Si existe el token de refresh
        if (refresh) {
            try {
                // Intentar notificar al servidor el cierre de sesión
                await logoutAPI(refresh);
        
            } catch (err) {
                
            }
        }

        // Eliminar tokens del almacenamiento local
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');

        // Eliminar el encabezado de autorización por defecto de Axios
        delete axiosInstance.defaults.headers.common.Authorization;

        // Limpiar el estado del usuario en la app (logout visual)
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, signin, signout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
