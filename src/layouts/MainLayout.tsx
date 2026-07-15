import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PageId } from '../types'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

type MainLayoutProps = {
  activePage: PageId
  children: ReactNode
  onNavigate: (page: PageId) => void
}

export function MainLayout({ activePage, children, onNavigate }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function handleNavigate(page: PageId) {
    onNavigate(page)
    setIsSidebarOpen(false)
  }

  return (
    <div className={isSidebarOpen ? 'app-shell sidebar-open' : 'app-shell'}>
      <button
        className="sidebar-backdrop"
        type="button"
        aria-label="Close navigation"
        onClick={() => setIsSidebarOpen(false)}
      />
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="content-area">
        <Header activePage={activePage} onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}
