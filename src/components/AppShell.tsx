import type { ReactNode } from 'react'
import type { PageId } from '../types'
import { MainLayout } from '../layouts/MainLayout'

type AppShellProps = {
  activePage: PageId
  children: ReactNode
  inventorySearch: string
  onInventorySearchChange: (value: string) => void
  onNavigate: (page: PageId) => void
}

export function AppShell({
  activePage,
  children,
  inventorySearch,
  onInventorySearchChange,
  onNavigate,
}: AppShellProps) {
  return (
    <MainLayout
      activePage={activePage}
      inventorySearch={inventorySearch}
      onInventorySearchChange={onInventorySearchChange}
      onNavigate={onNavigate}
    >
      {children}
    </MainLayout>
  )
}
