import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import '../../styles/auth.css'

const dashboardByRole = {
  admin: '/admin/dashboard',
  staff: '/staff/dashboard',
}

/**
 * Hitung kekuatan password
 * @returns {{ score: number, label: string, key: string }}
 */
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', key: '' }

  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: 'Lemah', key: 'weak' }
  if (score === 2) return { score: 2, label: 'Cukup', key: 'fair' }
  if (score === 3) return { score: 3, label: 'Bagus', key: 'good' }
  return { score: 4, label: 'Kuat', key: 'strong' }
}

function Register() {
  const navigate = useNavigate()
  const { register, isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Jika sudah login, redirect ke dashboard
  if (isAuthenticated) {
    return <Navigate to={dashboardByRole[user.role] || '/login'} replace />
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
    // Clear specific field error
    if (fieldErrors[name]) {
      setFieldErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    // Client-side validation
    if (formData.password.length < 6) {
      setFieldErrors({ password: 'Password minimal 6 karakter.' })
      return
    }

    if (formData.password !== formData.password_confirmation) {
      setFieldErrors({ password_confirmation: 'Konfirmasi password tidak sesuai.' })
      return
    }

    setIsSubmitting(true)

    try {
      const authUser = await register(formData)
      navigate(dashboardByRole[authUser.role] || '/staff/dashboard', { replace: true })
    } catch (registerError) {
      const responseErrors = registerError.response?.data?.errors
      if (responseErrors) {
        // Map backend validation errors to field errors
        const mapped = {}
        Object.entries(responseErrors).forEach(([key, messages]) => {
          mapped[key] = Array.isArray(messages) ? messages[0] : messages
        })
        setFieldErrors(mapped)
      }

      const message =
        registerError.response?.data?.message ||
        registerError.message ||
        'Registrasi gagal. Silakan coba lagi.'

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
                <h2 className="auth-title" style={{ fontSize: '20px' }}>Bergabung Sekarang</h2>
                <p className="auth-subtitle mt-2">Daftarkan akun Anda dan mulai kelola inventaris dengan efisien.</p>
              </div>

              <div className="auth-features">
                <div className="auth-feature">
                  <div className="feature-icon cyan">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h6>Gratis untuk Tim</h6>
                    <p>Daftarkan seluruh anggota tim tanpa biaya tambahan</p>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="feature-icon violet">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h6>Setup Cepat</h6>
                    <p>Mulai dalam hitungan menit tanpa konfigurasi rumit</p>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="feature-icon emerald">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h6>Dukungan Penuh</h6>
                    <p>Tim support siap membantu Anda 24/7</p>
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
                  <h1 className="auth-title">Buat Akun Baru ✨</h1>
                  <p className="auth-subtitle">Isi formulir di bawah untuk mendaftar</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert" id="register-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} id="register-form">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="register-name">
                      Nama Lengkap
                    </label>
                    <input
                      autoComplete="name"
                      className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                      disabled={isSubmitting}
                      id="register-name"
                      name="name"
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      required
                      type="text"
                      value={formData.name}
                    />
                    {fieldErrors.name && (
                      <div className="invalid-feedback" style={{ color: '#fca5a5' }}>
                        {fieldErrors.name}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="register-email">
                      Email
                    </label>
                    <input
                      autoComplete="email"
                      className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                      disabled={isSubmitting}
                      id="register-email"
                      name="email"
                      onChange={handleChange}
                      placeholder="nama@perusahaan.com"
                      required
                      type="email"
                      value={formData.email}
                    />
                    {fieldErrors.email && (
                      <div className="invalid-feedback" style={{ color: '#fca5a5' }}>
                        {fieldErrors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="register-password">
                      Password
                    </label>
                    <div className="password-wrapper">
                      <input
                        autoComplete="new-password"
                        className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                        disabled={isSubmitting}
                        id="register-password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Minimal 6 karakter"
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
                    {fieldErrors.password && (
                      <div className="text-danger mt-1" style={{ fontSize: '12px', color: '#fca5a5' }}>
                        {fieldErrors.password}
                      </div>
                    )}
                    {/* Password strength meter */}
                    {formData.password && (
                      <>
                        <div className="password-strength">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`strength-bar ${level <= passwordStrength.score ? `active ${passwordStrength.key}` : ''}`}
                            />
                          ))}
                        </div>
                        <span className={`strength-label ${passwordStrength.key}`}>
                          {passwordStrength.label}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="register-password-confirm">
                      Konfirmasi Password
                    </label>
                    <div className="password-wrapper">
                      <input
                        autoComplete="new-password"
                        className={`form-control ${fieldErrors.password_confirmation ? 'is-invalid' : ''}`}
                        disabled={isSubmitting}
                        id="register-password-confirm"
                        name="password_confirmation"
                        onChange={handleChange}
                        placeholder="Ulangi password"
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.password_confirmation}
                        style={{ paddingRight: '44px' }}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
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
                    {fieldErrors.password_confirmation && (
                      <div className="text-danger mt-1" style={{ fontSize: '12px', color: '#fca5a5' }}>
                        {fieldErrors.password_confirmation}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                    type="submit"
                    id="register-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Mendaftarkan...
                      </>
                    ) : (
                      'Daftar Sekarang'
                    )}
                  </button>
                </form>

                <div className="auth-divider">atau</div>

                <p className="auth-footer-text">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="auth-link">
                    Masuk di sini
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

export default Register
