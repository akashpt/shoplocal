import type { ReactNode } from 'react'

type PanelProps = {
  children: ReactNode
  className?: string
}

export function Panel({ children, className = '' }: PanelProps) {
  return <article className={className ? `panel ${className}` : 'panel'}>{children}</article>
}

