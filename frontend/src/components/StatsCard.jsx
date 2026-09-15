import React from 'react'

export default function StatsCard({ icon: Icon, label, value, tone = 'ink' }) {
  const toneClasses = {
    ink: 'bg-ink-50 text-ink-600',
    amber: 'bg-amber-50 text-amber-700',
    moss: 'bg-moss-50 text-moss-600',
    brick: 'bg-brick-50 text-brick-600',
  }

  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${toneClasses[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-display text-2xl leading-none text-ink-900">{value}</p>
        <p className="mt-1 text-sm text-ink-400">{label}</p>
      </div>
    </div>
  )
}
