import type { ReactNode } from 'react'
import type { PageId } from '../types'

type AppShellProps = {
  activePage: PageId
  children: ReactNode
  onNavigate: (page: PageId) => void
}

const navItems: Array<{ id: PageId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'orders', label: 'Orders' },
  { id: 'offers', label: 'Offers' },
]

export function AppShell({ activePage, children, onNavigate }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SL</span>
          <div>
            <strong>ShopLocal</strong>
            <small>Merchant Studio</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              className={item.id === activePage ? 'nav-item active' : 'nav-item'}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Local commerce</p>
            <h1>{navItems.find((item) => item.id === activePage)?.label}</h1>
          </div>
          <button className="primary-action" type="button">
            New listing
          </button>
        </header>

        {children}
      </main>
    </div>
  )
}
