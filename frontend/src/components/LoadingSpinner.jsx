import React from 'react'

export default function LoadingSpinner({ label = 'Loading…', size = 'md', fullscreen = false }) {
  const dim = size === 'sm' ? 'h-4 w-4 border-2' : size === 'lg' ? 'h-10 w-10 border-[3px]' : 'h-6 w-6 border-2'

  const spinner = (
    <div className="flex flex-col items-center gap-3 py-10 text-ink-400">
      <span
        className={`${dim} animate-spin rounded-full border-ink-200 border-t-amber-500`}
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  )

  if (!fullscreen) return spinner

  return <div className="flex min-h-[40vh] items-center justify-center">{spinner}</div>
}
