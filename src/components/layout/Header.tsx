import { useEffect, useRef, useState } from 'react'
import { AppIcon } from '../ui/AppIcon'
import type { PageId } from '../../types'

type HeaderProps = {
  activePage: PageId
  inventoryView: 'list' | 'add' | 'profile'
  inventorySearch: string
  ordersSearch: string
  ordersView: 'list' | 'details'
  offersSearch: string
  offersView: 'list' | 'create'
  expensesSearch: string
  expensesView: 'list' | 'add'
  invoicesSearch: string
  invoicesView: 'list' | 'generate' | 'detail'
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
  onGenerateInvoice: () => void
  onInvoicesCancel: () => void
  onInvoicesSave: () => void
  onInvoicesPrint: () => void
  onInvoicesShare: () => void
  onInvoicesDownload: () => void
  onInvoicesSearchChange: (value: string) => void
  onMenuClick: () => void
}

const navItems: Array<{ id: PageId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'orders', label: 'Orders' },
  { id: 'tables', label: 'Table' },
  { id: 'offers', label: 'Offers' },
  { id: 'expenses', label: 'Expense Tracker' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'settings', label: 'Settings' },
  { id: 'shops', label: 'Manage Shops' },
]

export function Header({
  activePage,
  inventoryView,
  inventorySearch,
  ordersSearch,
  ordersView,
  offersSearch,
  offersView,
  expensesSearch,
  expensesView,
  invoicesSearch,
  invoicesView,
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
  onGenerateInvoice,
  onInvoicesCancel,
  onInvoicesSave,
  onInvoicesPrint,
  onInvoicesShare,
  onInvoicesDownload,
  onInvoicesSearchChange,
  onMenuClick,
}: HeaderProps) {
  const pageTitle = navItems.find((item) => item.id === activePage)?.label || 'Dashboard'
  const [openMenu, setOpenMenu] = useState<'notifications' | 'profile' | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const isInventoryPage = activePage === 'inventory'
  const isOrdersPage = activePage === 'orders'
  const isOffersPage = activePage === 'offers'
  const isExpensesPage = activePage === 'expenses'
  const isInvoicesPage = activePage === 'invoices'
  const isSettingsPage = activePage === 'settings'
  const isShopsPage = activePage === 'shops'
  const isInventoryDetail = isInventoryPage && inventoryView !== 'list'
  const isOrdersDetail = isOrdersPage && ordersView === 'details'
  const isOffersCreate = isOffersPage && offersView === 'create'
  const isExpensesAdd = isExpensesPage && expensesView === 'add'
  const isInvoicesGenerate = isInvoicesPage && invoicesView === 'generate'
  const isInvoicesDetail = isInvoicesPage && invoicesView === 'detail'
  const inventoryDetailTitle = inventoryView === 'add' ? 'Add Product' : 'Product Profile'

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMenu(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function toggleMenu(menu: 'notifications' | 'profile') {
    setOpenMenu((currentMenu) => (currentMenu === menu ? null : menu))
  }

  return (
    <header className="topbar" ref={headerRef}>
      <div className="topbar-left">
        <button className="menu-toggle" type="button" aria-label="Open navigation" onClick={onMenuClick}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1>
          {isInventoryDetail ? (
            <>
              <span className="title-muted">Inventory</span> {inventoryDetailTitle}
            </>
          ) : isOrdersDetail ? (
            <>
              <span className="title-muted">Orders</span> Order Details
            </>
          ) : isOffersCreate ? (
            <>
              <span className="title-muted">Offers</span> Create Offer
            </>
          ) : isExpensesAdd ? (
            <>
              <span className="title-muted">Expenses</span> Add Expense
            </>
          ) : isInvoicesGenerate ? (
            <>
              <span className="title-muted">Invoices</span> Generate Invoice
            </>
          ) : isInvoicesDetail ? (
            <>
              <span className="title-muted">Invoices</span> INV-2026-0094
            </>
          ) : (
            pageTitle
          )}
        </h1>
      </div>
      <div className="topbar-right">
        {isInventoryPage && inventoryView === 'list' && (
          <label className="header-search">
            <AppIcon name="search" />
            <input
              type="search"
              placeholder="Search products by name or ID..."
              value={inventorySearch}
              onChange={(event) => onInventorySearchChange(event.target.value)}
            />
          </label>
        )}
        {isOrdersPage && ordersView === 'list' && (
          <label className="header-search">
            <AppIcon name="search" />
            <input
              type="search"
              placeholder="Search Orders by Customer or ID..."
              value={ordersSearch}
              onChange={(event) => onOrdersSearchChange(event.target.value)}
            />
          </label>
        )}
        {isOffersPage && offersView === 'list' && (
          <label className="header-search">
            <AppIcon name="search" />
            <input
              type="search"
              placeholder="Search offers by name or code..."
              value={offersSearch}
              onChange={(event) => onOffersSearchChange(event.target.value)}
            />
          </label>
        )}
        {isExpensesPage && expensesView === 'list' && (
          <label className="header-search">
            <AppIcon name="search" />
            <input
              type="search"
              placeholder="Search expenses..."
              value={expensesSearch}
              onChange={(event) => onExpensesSearchChange(event.target.value)}
            />
          </label>
        )}
        {isInvoicesPage && invoicesView === 'list' && (
          <label className="header-search">
            <AppIcon name="search" />
            <input
              type="search"
              placeholder="Search by Invoice number or customer..."
              value={invoicesSearch}
              onChange={(event) => onInvoicesSearchChange(event.target.value)}
            />
          </label>
        )}
        <div className="action-buttons">
          {isShopsPage ? (
            <button className="action-button primary" type="button" onClick={() => window.dispatchEvent(new Event('shops:add'))}>
              Add new shop
            </button>
          ) : isSettingsPage ? (
            <button className="action-button primary" type="button" onClick={() => window.dispatchEvent(new Event('settings:save'))}>
              Save all changes
            </button>
          ) : isInvoicesDetail ? (
            <>
              <button className="action-button" type="button" onClick={onInvoicesPrint}>
                Print
              </button>
              <button className="action-button" type="button" onClick={onInvoicesShare}>
                Share
              </button>
              <button className="action-button primary" type="button" onClick={onInvoicesDownload}>
                Download PDF
              </button>
            </>
          ) : isInvoicesGenerate ? (
            <>
              <button className="action-button" type="button" onClick={onInvoicesCancel}>
                Cancel
              </button>
              <button className="action-button primary" type="button" onClick={onInvoicesSave}>
                Generate Invoice
              </button>
            </>
          ) : isInvoicesPage ? (
            <button className="action-button primary" type="button" onClick={onGenerateInvoice}>
              Generate Invoice
            </button>
          ) : isExpensesAdd ? (
            <>
              <button className="action-button" type="button" onClick={onExpensesCancel}>
                Cancel
              </button>
              <button className="action-button primary" type="button" onClick={onExpensesSave}>
                Add Expense
              </button>
            </>
          ) : isExpensesPage ? (
            <button className="action-button primary" type="button" onClick={onAddExpense}>
              Add Expense
            </button>
          ) : isOffersCreate ? (
            <>
              <button className="action-button" type="button" onClick={onOffersCancel}>
                Cancel
              </button>
              <button className="action-button primary" type="button" onClick={onOffersSave}>
                Create Offer
              </button>
            </>
          ) : isOrdersDetail ? (
            <>
              <button className="action-button" type="button" onClick={onOrdersBack}>
                Back
              </button>
              <button className="action-button" type="button" onClick={onOrdersPrint}>
                Print Invoice
              </button>
            </>
          ) : isInventoryDetail ? (
            <>
              <button className="action-button" type="button" onClick={onInventoryCancel}>
                Cancel
              </button>
              <button className="action-button primary" type="button" onClick={onInventorySave}>
                Save & Publish
              </button>
            </>
          ) : isInventoryPage ? (
            <>
              <button className="action-button" type="button">
                Import CSV
              </button>
              <button className="action-button" type="button">
                Export CSV
              </button>
              <button className="action-button primary" type="button" onClick={onAddProduct}>
                Add Product
              </button>
            </>
          ) : (
            <>
              <button className="action-button" type="button" onClick={onAddProduct}>
                Add Product
              </button>
              <button className="action-button" type="button" onClick={onAddExpense}>
                Add Expense
              </button>
              <button className="action-button primary" type="button" onClick={onCreateOffer}>
                Create Offer
              </button>
            </>
          )}
        </div>
        <div className="header-menu">
          <button
            className={openMenu === 'notifications' ? 'notification-icon active' : 'notification-icon'}
            type="button"
            aria-expanded={openMenu === 'notifications'}
            aria-label="Notifications"
            onClick={() => toggleMenu('notifications')}
          >
            <AppIcon name="bell" />
          </button>
          {openMenu === 'notifications' && (
            <div className="dropdown-panel notification-dropdown">
              <strong>Notifications</strong>
              <button type="button">
                <span>Low stock alert</span>
                <small>26 items need restocking</small>
              </button>
              <button type="button">
                <span>Offer performance</span>
                <small>SAVE20 reached 48 uses</small>
              </button>
            </div>
          )}
        </div>
        <div className="header-menu">
          <button
            className={openMenu === 'profile' ? 'user-avatar active' : 'user-avatar'}
            type="button"
            aria-expanded={openMenu === 'profile'}
            onClick={() => toggleMenu('profile')}
          >
            AM
          </button>
          {openMenu === 'profile' && (
            <div className="dropdown-panel profile-dropdown">
              <strong>Anita Mani</strong>
              <small>Store manager</small>
              <button className="mobile-menu-action" type="button" onClick={onAddProduct}>Add Product</button>
              <button className="mobile-menu-action" type="button" onClick={onAddExpense}>Add Expense</button>
              <button className="mobile-menu-action primary" type="button" onClick={onCreateOffer}>Create Offer</button>
              <button type="button">Manage profile</button>
              <button type="button">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
