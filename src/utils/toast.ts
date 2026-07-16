import type { ToastTone } from '../components/ui/Toast'

export function showToast(message: string, tone: ToastTone = 'info') {
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message, tone } }))
}
