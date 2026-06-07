import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="auth-page">
      <div className="container">
        <Outlet />
      </div>
    </main>
  )
}

export default AuthLayout
