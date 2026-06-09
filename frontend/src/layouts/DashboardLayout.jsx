import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('dashboard-theme')

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return 'dark'
}

function DashboardLayout({ role }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div
      className={`app-shell dashboard-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      data-bs-theme={theme}
      data-theme={theme}
    >
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        role={role}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((isCollapsed) => !isCollapsed)}
      />
      {isSidebarOpen && (
        <button
          aria-label="Tutup sidebar"
          className="sidebar-backdrop"
          type="button"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="app-main">
        <Navbar
          isDarkMode={theme === 'dark'}
          isSidebarCollapsed={isSidebarCollapsed}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed((isCollapsed) => !isCollapsed)}
          onToggleTheme={toggleTheme}
        />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
