import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

const isAuthEndpoint = (url = '') => (
  url.includes('/auth/login') || url.includes('/auth/register')
)

const redirectToLogin = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  if (
    window.location.pathname !== '/login' &&
    window.location.pathname !== '/register'
  ) {
    window.location.href = '/login'
  }
}

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (!isAuthEndpoint(config.url)) {
    redirectToLogin()
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Backend terlalu lama merespons. Coba lagi sebentar.'
    }

    if (error.response?.status === 401) {
      redirectToLogin()
    }

    return Promise.reject(error)
  },
)

export default axiosClient
