import { useEffect, useRef, useState } from 'react'
import type { PageId } from '../../types'

type HeaderProps = {
  activePage: PageId
  inventoryView: 'list' | 'add' | 'profile'
  inventorySearch: string
  onAddProduct: () => void
  onInventoryCancel: () => void
  onInventorySave: () => void
  onInventorySearchChange: (value: string) => void
  onMenuClick: () => void
}

const navItems: Array<{ id: PageId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'orders', label: 'Orders' },
  { id: 'offers', label: 'Offers' },
]

export function Header({
  activePage,
  inventoryView,
  inventorySearch,
  onAddProduct,
  onInventoryCancel,
  onInventorySave,
  onInventorySearchChange,
  onMenuClick,
}: HeaderProps) {
  const pageTitle = navItems.find((item) => item.id === activePage)?.label || 'Dashboard'
  const [openMenu, setOpenMenu] = useState<'notifications' | 'profile' | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const isInventoryPage = activePage === 'inventory'
  const isInventoryDetail = isInventoryPage && inventoryView !== 'list'
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
          ) : (
            pageTitle
          )}
        </h1>
      </div>
      <div className="topbar-right">
        {isInventoryPage && inventoryView === 'list' && (
          <label className="header-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
            <input
              type="search"
              placeholder="Search products by name or ID..."
              value={inventorySearch}
              onChange={(event) => onInventorySearchChange(event.target.value)}
            />
          </label>
        )}
        <div className="action-buttons">
          {isInventoryDetail ? (
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
              <button className="action-button" type="button">
                Add Expense
              </button>
              <button className="action-button primary" type="button">
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
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
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
              <button className="mobile-menu-action" type="button">Add Product</button>
              <button className="mobile-menu-action" type="button">Add Expense</button>
              <button className="mobile-menu-action primary" type="button">Create Offer</button>
              <button type="button">Manage profile</button>
              <button type="button">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
