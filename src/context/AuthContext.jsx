import React, { createContext, useContext, useState, useEffect } from 'react'
const AuthContext = createContext()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('bto_token')
    const storedUser = localStorage.getItem('bto_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
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
    loading
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
