import type { ReactNode } from 'react'
import type { PageId } from '../types'
import { MainLayout } from '../layouts/MainLayout'

type AppShellProps = {
  activePage: PageId
  children: ReactNode
  onNavigate: (page: PageId) => void
}

export function AppShell({ activePage, children, onNavigate }: AppShellProps) {
  return (
    <MainLayout activePage={activePage} onNavigate={onNavigate}>
      {children}
    </MainLayout>
  )
}
