import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!isLoggedIn) {
    // Save intended destination for redirect after login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
