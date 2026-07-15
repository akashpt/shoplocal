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
  ordersSearch: string
  ordersView: 'list' | 'details'
  offersSearch: string
  offersView: 'list' | 'create'
  onAddProduct: () => void
  onInventoryCancel: () => void
  onInventorySave: () => void
  onInventorySearchChange: (value: string) => void
  onOrdersBack: () => void
  onOrdersPrint: () => void
  onOrdersSearchChange: (value: string) => void
  onCreateOffer: () => void
  onOffersCancel: () => void
  onOffersSave: () => void
  onOffersSearchChange: (value: string) => void
  onNavigate: (page: PageId) => void
}

export function MainLayout({
  activePage,
  children,
  inventoryView,
  inventorySearch,
  ordersSearch,
  ordersView,
  offersSearch,
  offersView,
  onAddProduct,
  onInventoryCancel,
  onInventorySave,
  onInventorySearchChange,
  onOrdersBack,
  onOrdersPrint,
  onOrdersSearchChange,
  onCreateOffer,
  onOffersCancel,
  onOffersSave,
  onOffersSearchChange,
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
          ordersSearch={ordersSearch}
          ordersView={ordersView}
          offersSearch={offersSearch}
          offersView={offersView}
          onAddProduct={onAddProduct}
          onInventoryCancel={onInventoryCancel}
          onInventorySave={onInventorySave}
          onInventorySearchChange={onInventorySearchChange}
          onOrdersBack={onOrdersBack}
          onOrdersPrint={onOrdersPrint}
          onOrdersSearchChange={onOrdersSearchChange}
          onCreateOffer={onCreateOffer}
          onOffersCancel={onOffersCancel}
          onOffersSave={onOffersSave}
          onOffersSearchChange={onOffersSearchChange}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}
