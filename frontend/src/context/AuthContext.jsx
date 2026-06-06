import { useCallback, useMemo, useState } from 'react'
import { loginRequest, logoutRequest } from '../api/authApi'
import { AuthContext } from './authCore'

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user')

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => getStoredUser())
  const isLoading = false

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials)
    const { token: authToken, user: authUser } = response.data

    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(authUser))

    setToken(authToken)
    setUser(authUser)

    return authUser
  }, [])

  const logout = useCallback(async () => {
    try {
      if (token) {
        await logoutRequest()
      }
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
