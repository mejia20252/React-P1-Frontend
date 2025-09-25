// src/components/PublicRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const roleHome = (role?: string) => {
  switch (role) {
    case 'Administrador': return '/administrador'
    case 'Propietario':       return '/propietario'
    case 'Inquilino':       return '/inquilino'
    case 'Seguridad':       return '/seguridad'
    case 'Trabajador':       return '/trabajador'
    default: return '/unauthorized'; 
  }
}

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={roleHome(user.rol?.nombre)} replace />
  return children
}

export default PublicRoute
