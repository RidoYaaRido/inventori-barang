import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import '../../styles/auth.css'

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
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Jika sudah login, redirect ke dashboard
  if (isAuthenticated) {
    return <Navigate to={dashboardByRole[user.role] || '/login'} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
    // Clear error saat user mulai mengetik
    if (error) setError('')
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
        loginError.message ||
        'Login gagal. Periksa email dan password Anda.'

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8 col-xl-7">
        <div className="card auth-card">
          <div className="row g-0">
            {/* ── Left Panel: Info ─────────────────── */}
            <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-center p-4 p-xl-5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="mb-4">
                <div className="brand-mark mb-3">IMS</div>
                <h2 className="auth-title" style={{ fontSize: '20px' }}>Inventory Management System</h2>
                <p className="auth-subtitle mt-2">Platform manajemen inventaris modern untuk efisiensi operasional bisnis Anda.</p>
              </div>

              <div className="auth-features">
                <div className="auth-feature">
                  <div className="feature-icon cyan">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h6>Keamanan Terjamin</h6>
                    <p>Autentikasi aman dengan enkripsi data end-to-end</p>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="feature-icon violet">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h6>Monitoring Real-time</h6>
                    <p>Pantau stok barang secara langsung dari dashboard</p>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="feature-icon emerald">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h6>Laporan Analitik</h6>
                    <p>Analisis data inventaris yang komprehensif</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Panel: Form ───────────────── */}
            <div className="col-lg-7">
              <div className="p-4 p-md-5">
                {/* Mobile only brand */}
                <div className="text-center d-lg-none mb-4">
                  <div className="brand-mark mx-auto mb-3">IMS</div>
                </div>

                <div className="mb-4">
                  <h1 className="auth-title">Selamat Datang 👋</h1>
                  <p className="auth-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert" id="login-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} id="login-form">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="login-email">
                      Email
                    </label>
                    <input
                      autoComplete="email"
                      className="form-control"
                      disabled={isSubmitting}
                      id="login-email"
                      name="email"
                      onChange={handleChange}
                      placeholder="admin@inventory.local"
                      required
                      type="email"
                      value={formData.email}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label mb-0" htmlFor="login-password">
                        Password
                      </label>
                    </div>
                    <div className="password-wrapper">
                      <input
                        autoComplete="current-password"
                        className="form-control"
                        disabled={isSubmitting}
                        id="login-password"
                        name="password"
                        onChange={handleChange}
                        placeholder=""
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        style={{ paddingRight: '44px' }}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember-me" />
                      <label className="form-check-label" htmlFor="remember-me">
                        Ingat saya
                      </label>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                    type="submit"
                    id="login-submit"
                  >
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
                      'Masuk'
                    )}
                  </button>
                </form>

                <div className="auth-divider">atau</div>

                <p className="auth-footer-text">
                  Belum punya akun?{' '}
                  <Link to="/register" className="auth-link">
                    Daftar Jadi Staff
                  </Link>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
