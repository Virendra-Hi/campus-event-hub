import React from 'react'

export default function SeatIndicator({ available, total, compact = false }) {
  const safeTotal = total > 0 ? total : 1
  const ratio = Math.max(0, Math.min(1, available / safeTotal))
  const isFull = available <= 0
  const isFilling = !isFull && ratio <= 0.2

  const tone = isFull ? 'brick' : isFilling ? 'amber' : 'moss'
  const label = isFull ? 'Full' : isFilling ? 'Filling fast' : 'Open'

  const toneClasses = {
    brick: 'text-brick-600 bg-brick-50',
    amber: 'text-amber-700 bg-amber-50',
    moss: 'text-moss-600 bg-moss-50',
  }

  const barClasses = {
    brick: 'bg-brick',
    amber: 'bg-amber-500',
    moss: 'bg-moss',
  }

  if (compact) {
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>
        {label}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-ink-400">
        <span className={`font-medium ${toneClasses[tone].split(' ')[0]}`}>{label}</span>
        <span>
          {Math.max(available, 0)} of {total} seats left
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-50">
        <div
          className={`h-full rounded-full ${barClasses[tone]} transition-[width] duration-500`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}
