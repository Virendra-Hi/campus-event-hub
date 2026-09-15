import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, ArrowUpRight } from 'lucide-react'
import SeatIndicator from './SeatIndicator.jsx'
import { formatEventDate } from '../utils/format.js'

export default function EventCard({ event }) {
  const { id, title, eventDate, venue, totalSeats, availableSeats } = event
  const isFull = availableSeats <= 0

  return (
    <Link
      to={`/events/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-card bg-white shadow-card transition-shadow duration-200 hover:shadow-lift"
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-ink-900 line-clamp-2">{title}</h3>
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-amber-50 group-hover:text-amber-700">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="space-y-1.5 text-sm text-ink-400">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="shrink-0 text-ink-400" />
            <span>{formatEventDate(eventDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0 text-ink-400" />
            <span className="line-clamp-1">{venue}</span>
          </div>
        </div>
      </div>

      {/* ticket perforation */}
      <div className="relative mx-5">
        <div className="border-t border-dashed border-ink-100" />
        <span className="absolute -left-[27px] -top-2 h-4 w-4 rounded-full bg-paper" />
        <span className="absolute -right-[27px] -top-2 h-4 w-4 rounded-full bg-paper" />
      </div>

      <div className="flex items-center justify-between gap-3 p-5 pt-4">
        <div className="flex-1">
          <SeatIndicator available={availableSeats} total={totalSeats} />
        </div>
        {isFull && (
          <span className="shrink-0 rounded-full bg-brick-50 px-2.5 py-1 text-xs font-medium text-brick-600">
            Full
          </span>
        )}
      </div>
    </Link>
  )
}
