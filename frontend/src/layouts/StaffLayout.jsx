import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function StaffLayout() {
  return (
    <div className="app-shell">
      <Sidebar role="staff" />
      <div className="app-main">
        <Navbar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StaffLayout
