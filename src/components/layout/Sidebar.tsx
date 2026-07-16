import { AppIcon } from '../ui/AppIcon'
import type { PageId } from '../../types'

type SidebarProps = {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

const mainNavItems: Array<{ id: PageId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'orders', label: 'Orders' },
  { id: 'tables', label: 'Table' },
  { id: 'offers', label: 'Offers' },
]

const financeNavItems: Array<{ id: PageId; label: string }> = [
  { id: 'expenses', label: 'Expenses' },
  { id: 'invoices', label: 'Invoices' },
]

const accountNavItems: Array<{ id: PageId; label: string }> = [
  { id: 'shops', label: 'Manage Shops' },
  { id: 'settings', label: 'Settings' },
]

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <AppIcon name="layers" />
        </span>
        <div>
          <strong>ShopLocal</strong>
          <div className="brand-status">
            <span>Store <b>Open</b></span>
            <span className="brand-status-dot"></span>
          </div>
        </div>
      </div>

      <nav aria-label="Main navigation">
        <NavSection
          label="MAIN"
          items={mainNavItems}
          activePage={activePage}
          onNavigate={onNavigate}
        />
        <NavSection
          label="FINANCES"
          items={financeNavItems}
          activePage={activePage}
          onNavigate={onNavigate}
        />
        <NavSection
          label="ACCOUNT"
          items={accountNavItems}
          activePage={activePage}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="sidebar-footer">
        <button className="open-pos-button" type="button">
          Open POS Counter
        </button>
      </div>
    </aside>
  )
}

type NavSectionProps = {
  label: string
  items: Array<{ id: PageId; label: string }>
  activePage: PageId
  onNavigate: (page: PageId) => void
}

function NavSection({ label, items, activePage, onNavigate }: NavSectionProps) {
  return (
    <div className="nav-section">
      <div className="nav-section-label">{label}</div>
      <div className="nav-list">
        {items.map((item) => (
          <button
            className={item.id === activePage ? 'nav-item active' : 'nav-item'}
            key={`${item.label}-${item.id}`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
