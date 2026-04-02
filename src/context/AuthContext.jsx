import React, { createContext, useContext, useState, useEffect } from 'react'
import { userAPI } from '../api/endpoints.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)  // true while fetching fresh role from DB

  useEffect(() => {
    async function syncAuth() {
      try {
        const storedToken = localStorage.getItem('bto_token')
        const storedUser = localStorage.getItem('bto_user')

        if (storedToken) {
          setToken(storedToken)
          // Set initial user from cache to avoid flicker
          if (storedUser) setUser(JSON.parse(storedUser))

          // Now fetch FRESH role from DB
          setSyncing(true)
          const profile = await userAPI.getProfile()
          if (profile.success) {
            setUser(profile.user)
            localStorage.setItem('bto_user', JSON.stringify(profile.user))
          }
        }
      } catch (err) {
        console.error('Auth sync failed:', err)
        if (err.response?.status === 401) {
          logout()
        }
      } finally {
        setSyncing(false)
        setLoading(false)
      }
    }
    syncAuth()
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('bto_token', authToken)
    localStorage.setItem('bto_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('bto_token')
    localStorage.removeItem('bto_user')
  }
  const value = {
    user,
    token,
    isLoggedIn: !!token,
    login,
    logout,
    loading,
    syncing
  }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
