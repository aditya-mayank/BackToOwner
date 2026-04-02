import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, isLoggedIn, loading, syncing } = useAuth()

  // Wait for BOTH initial load AND profile sync to complete
  // This prevents premature redirect while fresh role is being fetched from DB
  if (loading || syncing) return null

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  if ((user?.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
