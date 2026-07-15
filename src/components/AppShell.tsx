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
  expensesSearch: string
  expensesView: 'list' | 'add'
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
  onAddExpense: () => void
  onExpensesCancel: () => void
  onExpensesSave: () => void
  onExpensesSearchChange: (value: string) => void
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
  expensesSearch,
  expensesView,
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
  onAddExpense,
  onExpensesCancel,
  onExpensesSave,
  onExpensesSearchChange,
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
      expensesSearch={expensesSearch}
      expensesView={expensesView}
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
      onAddExpense={onAddExpense}
      onExpensesCancel={onExpensesCancel}
      onExpensesSave={onExpensesSave}
      onExpensesSearchChange={onExpensesSearchChange}
      onNavigate={onNavigate}
    >
      {children}
    </MainLayout>
  )
}
