import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

const dashboardByRole = {
  admin: '/admin/dashboard',
  staff: '/staff/dashboard',
}

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={dashboardByRole[user.role] || '/login'} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const authUser = await login(formData)
      navigate(dashboardByRole[authUser.role] || '/login', { replace: true })
    } catch (loginError) {
      const message =
        loginError.response?.data?.message ||
        loginError.response?.data?.errors?.email?.[0] ||
        'Login gagal. Periksa email dan password.'

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
        <div className="card auth-card">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="brand-mark mx-auto mb-3">IMS</div>
              <h1 className="h4 fw-bold mb-1">Inventory Management System</h1>
              <p className="text-secondary">Masuk untuk mengelola data inventory</p>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  autoComplete="email"
                  className="form-control"
                  disabled={isSubmitting}
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="admin@inventory.local"
                  required
                  type="email"
                  value={formData.email}
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  autoComplete="current-password"
                  className="form-control"
                  disabled={isSubmitting}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  required
                  type="password"
                  value={formData.password}
                />
              </div>

              <button className="btn btn-primary w-100" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Memproses...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
