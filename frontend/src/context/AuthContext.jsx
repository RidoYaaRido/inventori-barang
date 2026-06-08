import { useCallback, useMemo, useState } from 'react'
import { loginRequest, logoutRequest, registerRequest } from '../api/authApi'
import { AuthContext } from './authCore'

/**
 * Membaca user dari localStorage dengan error handling.
 */
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

const getAuthPayload = (response) => {
  const payload = response.data?.data || response.data

  return {
    token: payload?.token,
    user: payload?.user,
  }
}

/**
 * AuthProvider — menyediakan state autentikasi ke seluruh aplikasi.
 *
 * Fitur:
 * - Login & Register
 * - Logout (clear localStorage + API call)
 * - Auto-load dari localStorage saat init
 * - Role-based access data (user.role)
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => getStoredUser())
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (credentials) => {
    setIsLoading(true)

    try {
      const response = await loginRequest(credentials)
      const { token: authToken, user: authUser } = getAuthPayload(response)

      if (!authToken || !authUser) {
        throw new Error('Response login tidak valid dari backend.')
      }

      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(authUser))

      setToken(authToken)
      setUser(authUser)

      return authUser
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setIsLoading(true)

    try {
      const response = await registerRequest(payload)
      const { token: authToken, user: authUser } = getAuthPayload(response)

      if (!authToken || !authUser) {
        throw new Error('Response register tidak valid dari backend.')
      }

      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(authUser))

      setToken(authToken)
      setUser(authUser)

      return authUser
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      if (token) {
        await logoutRequest()
      }
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      setIsLoading(false)
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
    }),
    [token, user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
