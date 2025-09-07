// src/components/PublicRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const roleHome = (role?: string) => {
  switch (role) {
    case 'Administrador': return '/administrador'
    case 'Cliente':       return '/cliente'
    case 'Cajero':        return '/cajero'
    case 'Repartidor':    return '/repartidor'
    default:              return '/not-found'
  }
}

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={roleHome(user.rol?.nombre)} replace />
  return children
}

export default PublicRoute
