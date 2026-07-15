import type { ReactNode } from 'react'

type FormFieldProps = {
  children: ReactNode
  className?: string
  help?: string
  label: string
}

export function FormField({ children, className = '', help, label }: FormFieldProps) {
  return (
    <label className={className ? `form-field ${className}` : 'form-field'}>
      <span>{label}</span>
      {children}
      {help && <small>{help}</small>}
    </label>
  )
}

