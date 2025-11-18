import { createContext, useState, useEffect, useContext } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    setUser(response.data.user)
    return response
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    return response
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateUser = (newUser) => {
    try {
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (e) {
      console.error('Failed to update user in localStorage', e)
    }
    setUser(newUser)
  }

  const refreshUser = async () => {
    try {
      const res = await authService.getMe()
      if (res && res.data) {
        updateUser(res.data)
      }
    } catch (err) {
      console.error('Failed to refresh user', err)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}



