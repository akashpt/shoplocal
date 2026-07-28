import { AppIcon } from '../ui/AppIcon'
import type { AppIconName } from '../ui/AppIcon'
import type { PageId } from '../../types'

type SidebarProps = {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

type SidebarNavItem = {
  id: PageId
  icon: AppIconName
  label: string
}

const mainNavItems: SidebarNavItem[] = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', icon: 'box', label: 'Inventory' },
  { id: 'orders', icon: 'cart', label: 'Orders' },
  { id: 'tables', icon: 'table', label: 'Table' },
  { id: 'offers', icon: 'tag', label: 'Offers' },
]

const financeNavItems: SidebarNavItem[] = [
  { id: 'expenses', icon: 'cash', label: 'Expenses' },
  { id: 'invoices', icon: 'invoice', label: 'Invoices' },
]

const accountNavItems: SidebarNavItem[] = [
  { id: 'shops', icon: 'shops', label: 'Manage Shops' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
]

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-stack">
            <span></span>
            <span></span>
            <span></span>
          </span>
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
          Open Dine in Counter
        </button>
        <button className="open-pos-button" type="button">
          Open Takeaway Counter
        </button>
      </div>
    </aside>
  )
}

type NavSectionProps = {
  label: string
  items: SidebarNavItem[]
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
            <AppIcon name={item.icon} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
