import { useEffect, useState } from 'react'
import './App.css'
import { AppShell } from './components/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Expenses } from './pages/Expenses'
import { Inventory } from './pages/Inventory'
import { Invoices } from './pages/Invoices'
import { ManageShops } from './pages/ManageShops'
import { Offers } from './pages/Offers'
import { Orders } from './pages/Orders'
import { Settings } from './pages/Settings'
import type { PageId } from './types'

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

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && (
        <div className="page-loader" role="status" aria-label="Loading ShopLocal">
          <div className="loader-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 5 7 3.5-7 3.5-7-3.5L12 5Z" />
              <path d="m5 12 7 3.5 7-3.5" />
              <path d="m5 15.5 7 3.5 7-3.5" />
            </svg>
          </div>
          <strong>ShopLocal</strong>
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
        }}
        onInventoryCancel={() => setInventoryView('list')}
        onInventorySave={() => window.dispatchEvent(new Event('inventory:save'))}
        onInventorySearchChange={setInventorySearch}
        onOrdersBack={() => setOrdersView('list')}
        onOrdersPrint={() => window.print()}
        onOrdersSearchChange={setOrdersSearch}
        onCreateOffer={() => {
          setActivePage('offers')
          setOffersView('create')
        }}
        onOffersCancel={() => setOffersView('list')}
        onOffersSave={() => setOffersView('list')}
        onOffersSearchChange={setOffersSearch}
        onAddExpense={() => {
          setActivePage('expenses')
          setExpensesView('add')
        }}
        onExpensesCancel={() => setExpensesView('list')}
        onExpensesSave={() => window.dispatchEvent(new Event('expenses:save'))}
        onExpensesSearchChange={setExpensesSearch}
        onGenerateInvoice={() => {
          setActivePage('invoices')
          setInvoicesView('generate')
        }}
        onInvoicesCancel={() => setInvoicesView('list')}
        onInvoicesSave={() => window.dispatchEvent(new Event('invoices:save'))}
        onInvoicesPrint={() => window.print()}
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
