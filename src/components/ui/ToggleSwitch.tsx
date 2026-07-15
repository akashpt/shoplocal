type ToggleSwitchProps = {
  checked: boolean
  className?: string
  label: string
  onChange: (checked: boolean) => void
  size?: 'sm' | 'md'
}

export function ToggleSwitch({ checked, className = '', label, onChange, size = 'sm' }: ToggleSwitchProps) {
  return (
    <button
      className={`toggle-switch ${size === 'md' ? 'md' : 'sm'}${checked ? ' active' : ''}${className ? ` ${className}` : ''}`}
      type="button"
      aria-label={label}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <i></i>
    </button>
  )
}

