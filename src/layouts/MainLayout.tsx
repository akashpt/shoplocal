import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PageId } from '../types'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

type MainLayoutProps = {
  activePage: PageId
  children: ReactNode
  inventoryView: 'list' | 'add' | 'profile'
  inventorySearch: string
  onAddProduct: () => void
  onInventoryCancel: () => void
  onInventorySave: () => void
  onInventorySearchChange: (value: string) => void
  onNavigate: (page: PageId) => void
}

export function MainLayout({
  activePage,
  children,
  inventoryView,
  inventorySearch,
  onAddProduct,
  onInventoryCancel,
  onInventorySave,
  onInventorySearchChange,
  onNavigate,
}: MainLayoutProps) {
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
        <Header
          activePage={activePage}
          inventoryView={inventoryView}
          inventorySearch={inventorySearch}
          onAddProduct={onAddProduct}
          onInventoryCancel={onInventoryCancel}
          onInventorySave={onInventorySave}
          onInventorySearchChange={onInventorySearchChange}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}
