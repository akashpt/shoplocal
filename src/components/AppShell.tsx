import type { ReactNode } from 'react'
import type { PageId } from '../types'
import { MainLayout } from '../layouts/MainLayout'

type AppShellProps = {
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

export function AppShell({
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
}: AppShellProps) {
  return (
    <MainLayout
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
      onNavigate={onNavigate}
    >
      {children}
    </MainLayout>
  )
}
