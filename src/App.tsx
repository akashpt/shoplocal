import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'
import { AppShell } from './components/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Inventory } from './pages/Inventory'
import { Offers } from './pages/Offers'
import { Orders } from './pages/Orders'
import type { PageId } from './types'

const pages: Record<PageId, ReactNode> = {
  dashboard: <Dashboard />,
  inventory: <Inventory />,
  orders: <Orders />,
  offers: <Offers />,
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [isLoading, setIsLoading] = useState(true)

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
      <AppShell activePage={activePage} onNavigate={setActivePage}>
        {pages[activePage]}
      </AppShell>
    </>
  )
}

export default App
