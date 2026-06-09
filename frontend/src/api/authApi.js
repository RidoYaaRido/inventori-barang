import axiosInstance from './axiosInstance'

const AUTH_TIMEOUT = 120000

const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')
}

const requestWithTimeoutRetry = async (request) => {
  try {
    return await request()
  } catch (error) {
    if (!isTimeoutError(error)) {
      throw error
    }

    return request()
  }
}

/**
 * Login request
 * @param {{ email: string, password: string }} credentials
 */
export const loginRequest = (credentials) => {
  return requestWithTimeoutRetry(() => (
    axiosInstance.post('/auth/login', credentials, { timeout: AUTH_TIMEOUT })
  ))
}

/**
 * Register request
 * @param {{ name: string, email: string, password: string, password_confirmation: string }} payload
 */
export const registerRequest = (payload) => {
  return axiosInstance.post('/auth/register', payload, { timeout: AUTH_TIMEOUT })
}

/**
 * Logout request
 */
export const logoutRequest = () => {
  return axiosInstance.post('/auth/logout')
}

/**
 * Get current authenticated user
 */
export const getCurrentUserRequest = () => {
  return axiosInstance.get('/auth/me')
}
