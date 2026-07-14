import type { ReactNode } from 'react'
import type { PageId } from '../types'

type AppShellProps = {
  activePage: PageId
  children: ReactNode
  onNavigate: (page: PageId) => void
}

const mainNavItems: Array<{ id: PageId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'orders', label: 'Orders' },
  { id: 'offers', label: 'Offers' },
]

const financeNavItems: Array<{ id: PageId; label: string }> = [
  { id: 'orders', label: 'Expenses' },
  { id: 'offers', label: 'Invoices' },
]

const accountNavItems: Array<{ id: PageId; label: string }> = [
  { id: 'inventory', label: 'Manage Shops' },
  { id: 'offers', label: 'Settings' },
]

export function AppShell({ activePage, children, onNavigate }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">🛍️</span>
          <div>
            <strong>ShopLocal</strong>
            <small>Store Open</small>
            <div className="brand-status">
              <span className="brand-status-dot"></span>
              <span>Store Open</span>
            </div>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <div className="nav-section">
            <div className="nav-section-label">MAIN</div>
            <div className="nav-list">
              {mainNavItems.map((item) => (
                <button
                  className={item.id === activePage ? 'nav-item active' : 'nav-item'}
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">FINANCES</div>
            <div className="nav-list">
              {financeNavItems.map((item) => (
                <button
                  className={item.id === activePage ? 'nav-item active' : 'nav-item'}
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">ACCOUNT</div>
            <div className="nav-list">
              {accountNavItems.map((item) => (
                <button
                  className={item.id === activePage ? 'nav-item active' : 'nav-item'}
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <button className="open-pos-button" type="button">
          Open POS Counter
        </button>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div className="topbar-left">
            <h1>{navItems.find((item) => item.id === activePage)?.label}</h1>
          </div>
          <div className="topbar-right">
            <div className="action-buttons">
              <button className="action-button" type="button">
                Add Product
              </button>
              <button className="action-button" type="button">
                Add Expense
              </button>
              <button className="action-button primary" type="button">
                Create Offer
              </button>
            </div>
            <button className="notification-icon" type="button" aria-label="Notifications">
              🔔
            </button>
            <div className="user-avatar">AM</div>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}

const navItems: Array<{ id: PageId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'orders', label: 'Orders' },
  { id: 'offers', label: 'Offers' },
]
