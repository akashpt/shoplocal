import { useEffect, useState } from 'react'
import './App.css'
import { AppShell } from './components/AppShell'
import { AppIcon } from './components/ui/AppIcon'
import { Toast, type ToastTone } from './components/ui/Toast'
import { Dashboard } from './pages/Dashboard'
import { Expenses } from './pages/Expenses'
import { Inventory } from './pages/Inventory'
import { Invoices } from './pages/Invoices'
import { ManageShops } from './pages/ManageShops'
import { Offers } from './pages/Offers'
import { Orders } from './pages/Orders'
import { Settings } from './pages/Settings'
import { Tables } from './pages/Tables'
import type { PageId } from './types'
import { showToast } from './utils/toast'

type InventoryView = 'list' | 'add' | 'profile'
type OrdersView = 'list' | 'details'
type OffersView = 'list' | 'create'
type ExpensesView = 'list' | 'add'
type InvoicesView = 'list' | 'generate' | 'detail'

function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [inventorySearch, setInventorySearch] = useState('')
  const [inventoryView, setInventoryView] = useState<InventoryView>('list')
  const [ordersSearch, setOrdersSearch] = useState('')
  const [ordersView, setOrdersView] = useState<OrdersView>('list')
  const [offersSearch, setOffersSearch] = useState('')
  const [offersView, setOffersView] = useState<OffersView>('list')
  const [expensesSearch, setExpensesSearch] = useState('')
  const [expensesView, setExpensesView] = useState<ExpensesView>('list')
  const [invoicesSearch, setInvoicesSearch] = useState('')
  const [invoicesView, setInvoicesView] = useState<InvoicesView>('list')
  const [globalToast, setGlobalToast] = useState<{ message: string; tone: ToastTone } | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    let timer: number | undefined

    function handleToast(event: Event) {
      const { message, tone = 'info' } = (event as CustomEvent<{ message: string; tone?: ToastTone }>).detail || {}
      if (!message) {
        return
      }

      setGlobalToast({ message, tone })
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setGlobalToast(null), 2200)
    }

    window.addEventListener('app:toast', handleToast)
    return () => {
      window.removeEventListener('app:toast', handleToast)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {isLoading && (
        <div className="page-loader" role="status" aria-label="Loading ShopLocal">
          <div className="loader-mark">
            <AppIcon name="layers" />
          </div>
          <strong>ShopLocal</strong>
        </div>
      )}
      {globalToast && (
        <div className="global-toast-slot">
          <Toast message={globalToast.message} tone={globalToast.tone} />
        </div>
      )}
      <AppShell
        activePage={activePage}
        inventoryView={inventoryView}
        inventorySearch={inventorySearch}
        ordersSearch={ordersSearch}
        ordersView={ordersView}
        offersSearch={offersSearch}
        offersView={offersView}
        expensesSearch={expensesSearch}
        expensesView={expensesView}
        invoicesSearch={invoicesSearch}
        invoicesView={invoicesView}
        onAddProduct={() => {
          setActivePage('inventory')
          setInventoryView('add')
          showToast('Product form opened.', 'info')
        }}
        onInventoryCancel={() => {
          setInventoryView('list')
          showToast('Product changes cancelled.', 'warning')
        }}
        onInventorySave={() => window.dispatchEvent(new Event('inventory:save'))}
        onInventorySearchChange={setInventorySearch}
        onOrdersBack={() => setOrdersView('list')}
        onOrdersPrint={() => {
          window.print()
          showToast('Print dialog opened.', 'success')
        }}
        onOrdersSearchChange={setOrdersSearch}
        onCreateOffer={() => {
          setActivePage('offers')
          setOffersView('create')
          showToast('Offer form opened.', 'info')
        }}
        onOffersCancel={() => {
          setOffersView('list')
          showToast('Offer creation cancelled.', 'warning')
        }}
        onOffersSave={() => {
          setOffersView('list')
          showToast('Offer created successfully.', 'success')
        }}
        onOffersSearchChange={setOffersSearch}
        onAddExpense={() => {
          setActivePage('expenses')
          setExpensesView('add')
          showToast('Expense form opened.', 'info')
        }}
        onExpensesCancel={() => {
          setExpensesView('list')
          showToast('Expense entry cancelled.', 'warning')
        }}
        onExpensesSave={() => window.dispatchEvent(new Event('expenses:save'))}
        onExpensesSearchChange={setExpensesSearch}
        onGenerateInvoice={() => {
          setActivePage('invoices')
          setInvoicesView('generate')
          showToast('Invoice generator opened.', 'info')
        }}
        onInvoicesCancel={() => {
          setInvoicesView('list')
          showToast('Invoice generation cancelled.', 'warning')
        }}
        onInvoicesSave={() => window.dispatchEvent(new Event('invoices:save'))}
        onInvoicesPrint={() => {
          window.print()
          showToast('Invoice print dialog opened.', 'success')
        }}
        onInvoicesShare={() => window.dispatchEvent(new Event('invoices:share'))}
        onInvoicesDownload={() => window.dispatchEvent(new Event('invoices:download'))}
        onInvoicesSearchChange={setInvoicesSearch}
        onNavigate={(page) => {
          setActivePage(page)
          if (page !== 'inventory') {
            setInventoryView('list')
          }
          if (page !== 'orders') {
            setOrdersView('list')
          }
          if (page !== 'offers') {
            setOffersView('list')
          }
          if (page !== 'expenses') {
            setExpensesView('list')
          }
          if (page !== 'invoices') {
            setInvoicesView('list')
          }
        }}
      >
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'inventory' && (
          <Inventory
            searchQuery={inventorySearch}
            view={inventoryView}
            onViewChange={setInventoryView}
          />
        )}
        {activePage === 'orders' && (
          <Orders
            searchQuery={ordersSearch}
            view={ordersView}
            onViewChange={setOrdersView}
          />
        )}
        {activePage === 'tables' && <Tables />}
        {activePage === 'offers' && (
          <Offers
            searchQuery={offersSearch}
            view={offersView}
            onViewChange={setOffersView}
          />
        )}
        {activePage === 'expenses' && (
          <Expenses
            searchQuery={expensesSearch}
            view={expensesView}
            onViewChange={setExpensesView}
          />
        )}
        {activePage === 'invoices' && (
          <Invoices
            searchQuery={invoicesSearch}
            view={invoicesView}
            onViewChange={setInvoicesView}
          />
        )}
        {activePage === 'settings' && <Settings />}
        {activePage === 'shops' && <ManageShops />}
      </AppShell>
    </>
  )
}

export default App
