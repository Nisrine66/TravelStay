import React, { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authMethod, setAuthMethod] = useState(null)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('auth_user')
        
        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          setAuthMethod('token')
        }
      } catch (error) {
        // Clear auth on error
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const setAuth = useCallback((userData, accessToken = null, method = 'token') => {
    if (userData) {
      setUser(userData)
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
    if (accessToken) {
      setToken(accessToken)
      localStorage.setItem('auth_token', accessToken)
    }
    setAuthMethod(method)
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setToken(null)
    setAuthMethod(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }, [])

  const isAuthenticated = !!(user && token)

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    authMethod,
    setAuth,
    clearAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
