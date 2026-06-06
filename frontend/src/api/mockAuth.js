/**
 * Mock Authentication Service
 * Simulasi backend auth untuk development frontend-only.
 * Hapus file ini dan ganti ke real API ketika backend sudah siap.
 */

const MOCK_USERS = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin@inventory.local',
    password: 'password',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    email: 'staff@inventory.local',
    password: 'password',
    role: 'staff',
  },
]

// Simulate network delay
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate fake JWT-like token
const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: Date.now(),
    }),
  )
  const signature = btoa(`mock-signature-${user.id}-${Date.now()}`)
  return `${header}.${payload}.${signature}`
}

/**
 * Mock Login
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ data: { token: string, user: object } }>}
 */
export const mockLogin = async (credentials) => {
  await delay()

  const user = MOCK_USERS.find(
    (u) =>
      u.email === credentials.email && u.password === credentials.password,
  )

  if (!user) {
    const error = new Error('Login gagal')
    error.response = {
      status: 401,
      data: {
        message: 'Email atau password salah.',
      },
    }
    throw error
  }

  const { password: _, ...safeUser } = user

  return {
    data: {
      token: generateToken(user),
      user: safeUser,
    },
  }
}

/**
 * Mock Register
 * @param {{ name: string, email: string, password: string, password_confirmation: string }} payload
 * @returns {Promise<{ data: { token: string, user: object } }>}
 */
export const mockRegister = async (payload) => {
  await delay(1000)

  // Check if email already exists
  const existing = MOCK_USERS.find((u) => u.email === payload.email)
  if (existing) {
    const error = new Error('Register gagal')
    error.response = {
      status: 422,
      data: {
        message: 'Email sudah terdaftar.',
        errors: {
          email: ['Email sudah digunakan oleh akun lain.'],
        },
      },
    }
    throw error
  }

  // Check password confirmation match
  if (payload.password !== payload.password_confirmation) {
    const error = new Error('Register gagal')
    error.response = {
      status: 422,
      data: {
        message: 'Konfirmasi password tidak sesuai.',
        errors: {
          password_confirmation: ['Konfirmasi password tidak sesuai.'],
        },
      },
    }
    throw error
  }

  const newUser = {
    id: MOCK_USERS.length + 1,
    name: payload.name,
    email: payload.email,
    role: 'staff', // Default role for new users
  }

  // Add to mock users list (in-memory only)
  MOCK_USERS.push({ ...newUser, password: payload.password })

  return {
    data: {
      token: generateToken(newUser),
      user: newUser,
    },
  }
}

/**
 * Mock Logout
 * @returns {Promise<{ data: { message: string } }>}
 */
export const mockLogout = async () => {
  await delay(300)
  return {
    data: {
      message: 'Berhasil logout.',
    },
  }
}
