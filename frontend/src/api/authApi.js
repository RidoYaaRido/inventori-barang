import axiosClient from './axiosClient'

export const loginRequest = (credentials) => {
  return axiosClient.post('/auth/login', credentials)
}

export const registerRequest = (payload) => {
  return axiosClient.post('/auth/register', payload)
}

export const logoutRequest = () => {
  return axiosClient.post('/auth/logout')
}

export const getCurrentUserRequest = () => {
  return axiosClient.get('/auth/me')
}
