import { AppIcon, type AppIconName } from './AppIcon'

export type ToastTone = 'success' | 'warning' | 'error' | 'info'

type ToastProps = {
  message: string
  tone?: ToastTone
}

const toneIcons: Record<ToastTone, AppIconName> = {
  success: 'check-circle',
  warning: 'alert',
  error: 'trash',
  info: 'file-question',
}

export function Toast({ message, tone = 'info' }: ToastProps) {
  return (
    <div className={`app-toast ${tone}`} role="status">
      <span className="app-toast-icon">
        <AppIcon name={toneIcons[tone]} />
      </span>
      <span>{message}</span>
    </div>
  )
}
