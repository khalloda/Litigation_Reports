import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { useRTL } from '@hooks/useRTL'
import { useLanguage } from '@hooks/useLanguage'

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isRTL } = useRTL()
  const { currentLanguage } = useLanguage()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="layout-container d-flex flex-column vh-100">
      <Navbar 
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="layout-body d-flex flex-grow-1">
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
        
        <main 
          className={`main-content flex-grow-1 ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
          dir={isRTL ? 'rtl' : 'ltr'}
          lang={currentLanguage}
        >
          <div className="container-fluid p-4">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
