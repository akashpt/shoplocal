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
  onAddProduct: () => void
  onInventoryCancel: () => void
  onInventorySave: () => void
  onInventorySearchChange: (value: string) => void
  onOrdersBack: () => void
  onOrdersPrint: () => void
  onOrdersSearchChange: (value: string) => void
  onNavigate: (page: PageId) => void
}

export function AppShell({
  activePage,
  children,
  inventoryView,
  inventorySearch,
  ordersSearch,
  ordersView,
  onAddProduct,
  onInventoryCancel,
  onInventorySave,
  onInventorySearchChange,
  onOrdersBack,
  onOrdersPrint,
  onOrdersSearchChange,
  onNavigate,
}: AppShellProps) {
  return (
    <MainLayout
      activePage={activePage}
      inventoryView={inventoryView}
      inventorySearch={inventorySearch}
      ordersSearch={ordersSearch}
      ordersView={ordersView}
      onAddProduct={onAddProduct}
      onInventoryCancel={onInventoryCancel}
      onInventorySave={onInventorySave}
      onInventorySearchChange={onInventorySearchChange}
      onOrdersBack={onOrdersBack}
      onOrdersPrint={onOrdersPrint}
      onOrdersSearchChange={onOrdersSearchChange}
      onNavigate={onNavigate}
    >
      {children}
    </MainLayout>
  )
}
