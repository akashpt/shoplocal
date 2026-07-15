import type { ReactNode } from 'react'
import type { PageId } from '../types'
import { MainLayout } from '../layouts/MainLayout'

type AppShellProps = {
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

export function AppShell({
  activePage,
  children,
  inventoryView,
  inventorySearch,
  onAddProduct,
  onInventoryCancel,
  onInventorySave,
  onInventorySearchChange,
  onNavigate,
}: AppShellProps) {
  return (
    <MainLayout
      activePage={activePage}
      inventoryView={inventoryView}
      inventorySearch={inventorySearch}
      onAddProduct={onAddProduct}
      onInventoryCancel={onInventoryCancel}
      onInventorySave={onInventorySave}
      onInventorySearchChange={onInventorySearchChange}
      onNavigate={onNavigate}
    >
      {children}
    </MainLayout>
  )
}
