import axios from 'axios'

/**
 * Axios Instance — konfigurasi utama untuk semua API calls.
 *
 * Fitur:
 * - Base URL dari environment variable
 * - Auto-attach Bearer token dari localStorage
 * - Auto-redirect ke /login jika 401 Unauthorized
 * - Request/Response interceptors
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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

// ── Request Interceptor ──────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (!isAuthEndpoint(config.url)) {
      redirectToLogin()
    }

    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor ─────────────────────────────
axiosInstance.interceptors.response.use(
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

export default axiosInstance
