import React from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const styles = {
  success: { icon: CheckCircle2, bg: 'bg-moss text-white' },
  error: { icon: XCircle, bg: 'bg-brick text-white' },
  info: { icon: Info, bg: 'bg-ink text-white' },
}

export default function Toast({ message, variant = 'success', onDismiss }) {
  const { icon: Icon, bg } = styles[variant] || styles.info

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 rounded-xl ${bg} px-4 py-3 shadow-lift w-[calc(100vw-2rem)] sm:w-80 animate-toast-in`}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />
      <p className="text-sm leading-snug flex-1">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-80 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  )
}
