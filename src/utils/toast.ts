import type { ToastTone } from '../components/ui/Toast'

export function showToast(message: string, tone: ToastTone = 'info') {
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message, tone } }))
}

export function clearToast() {
  window.dispatchEvent(new Event('app:clear-toast'))
}
