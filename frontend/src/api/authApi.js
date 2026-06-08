import axiosInstance from './axiosInstance'

/**
 * Login request
 * @param {{ email: string, password: string }} credentials
 */
export const loginRequest = (credentials) => {
  return axiosInstance.post('/auth/login', credentials)
}

/**
 * Register request
 * @param {{ name: string, email: string, password: string, password_confirmation: string }} payload
 */
export const registerRequest = (payload) => {
  return axiosInstance.post('/auth/register', payload)
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
