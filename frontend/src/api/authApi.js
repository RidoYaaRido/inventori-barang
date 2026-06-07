import axiosInstance from './axiosInstance'
import { mockLogin, mockLogout, mockRegister } from './mockAuth'

/**
 * Flag: gunakan mock auth atau real API.
 * Set ke false ketika backend sudah siap.
 */
const USE_MOCK = true

/**
 * Login request
 * @param {{ email: string, password: string }} credentials
 */
export const loginRequest = (credentials) => {
  if (USE_MOCK) return mockLogin(credentials)
  return axiosInstance.post('/auth/login', credentials)
}

/**
 * Register request
 * @param {{ name: string, email: string, password: string, password_confirmation: string }} payload
 */
export const registerRequest = (payload) => {
  if (USE_MOCK) return mockRegister(payload)
  return axiosInstance.post('/auth/register', payload)
}

/**
 * Logout request
 */
export const logoutRequest = () => {
  if (USE_MOCK) return mockLogout()
  return axiosInstance.post('/auth/logout')
}

/**
 * Get current authenticated user
 */
export const getCurrentUserRequest = () => {
  return axiosInstance.get('/auth/me')
}
