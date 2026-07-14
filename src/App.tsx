import { useState } from 'react'
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

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      {pages[activePage]}
    </AppShell>
  )
}

export default App
