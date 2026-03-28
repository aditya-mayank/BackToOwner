import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function AdminRoute({ children }) {
  const { user, isLoggedIn, loading } = useAuth()
  if (loading) return null
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
