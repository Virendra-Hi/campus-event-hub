import React from 'react'
import { Ticket } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-ink-100/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-display text-base font-semibold text-ink-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-amber-400">
              <Ticket size={14} />
            </span>
            Campus Event Hub
          </div>
          <p className="text-sm text-ink-400">
            Built for students, by students. Find your next campus event.
          </p>
        </div>
        <div className="mt-6 border-t border-ink-100/70 pt-6 text-xs text-ink-400">
          © {new Date().getFullYear()} Campus Event Hub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
