import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-brick-100 bg-brick-50 px-6 py-10 text-center">
      <AlertTriangle className="text-brick" size={26} />
      <p className="max-w-sm text-sm text-brick-600">{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-1">
          <RotateCcw size={15} /> Try again
        </button>
      )}
    </div>
  )
}
