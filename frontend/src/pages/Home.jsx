import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck2, Users2, MapPinned } from 'lucide-react'
import eventService from '../services/eventService.js'
import { getFriendlyErrorMessage } from '../services/api.js'
import EventCard from '../components/EventCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { isUpcoming } from '../utils/format.js'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await eventService.getAll()
      setEvents(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Could not load upcoming events.'))
    } finally {
      setLoading(false)
    }
  }

  const upcoming = events.filter((e) => isUpcoming(e.eventDate)).slice(0, 3)
  const totalSeatsOpen = events.reduce((sum, e) => sum + Math.max(e.availableSeats || 0, 0), 0)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100/70 bg-ink text-paper">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-moss-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-medium text-amber-400">Fall semester lineup is live</p>
         <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.1] text-white sm:text-5xl">
           <span className="text-amber-400 underline decoration-amber-400 decoration-2 underline-offset-8">
             Discover
           </span>{" "}
           campus events worth showing up for.
         </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-100/90 sm:text-lg">
            Browse fests, workshops and talks happening around campus, and reserve your seat in
            seconds — no forms to print, no queues to stand in.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/events" className="btn-accent">
              Browse events <ArrowRight size={16} />
            </Link>
            <Link to="/admin/signup" className="btn border border-paper/25 text-paper hover:bg-paper/10">
              I'm an organizer
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <CalendarCheck2 size={20} />
            </span>
            <div>
              <p className="font-display text-2xl text-ink-900">{events.length}</p>
              <p className="text-sm text-ink-400">Events listed</p>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss-50 text-moss-600">
              <Users2 size={20} />
            </span>
            <div>
              <p className="font-display text-2xl text-ink-900">{totalSeatsOpen}</p>
              <p className="text-sm text-ink-400">Seats still open</p>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 text-ink-600">
              <MapPinned size={20} />
            </span>
            <div>
              <p className="font-display text-2xl text-ink-900">{upcoming.length}</p>
              <p className="text-sm text-ink-400">Coming up next</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events preview */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-ink-900">Upcoming events</h2>
            <p className="mt-1 text-sm text-ink-400">A quick look at what's on the calendar.</p>
          </div>
          <Link to="/events" className="hidden text-sm font-medium text-ink-600 hover:text-ink sm:inline-flex sm:items-center sm:gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading && <LoadingSpinner label="Loading upcoming events…" fullscreen />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}
        {!loading && !error && upcoming.length === 0 && (
          <p className="rounded-card border border-dashed border-ink-100 bg-white/60 px-6 py-12 text-center text-sm text-ink-400">
            No upcoming events yet — check back soon.
          </p>
        )}
        {!loading && !error && upcoming.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <Link to="/events" className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-ink-600 sm:hidden">
          View all events <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  )
}
