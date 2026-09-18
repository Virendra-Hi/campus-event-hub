import React, { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import eventService from '../services/eventService.js'
import { getFriendlyErrorMessage } from '../services/api.js'
import EventGrid from '../components/EventGrid.jsx'
import { isUpcoming } from '../utils/format.js'
import { COLLEGES } from '../config/colleges.js'
const FILTERS = [
  { id: 'all', label: 'All events' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'open', label: 'Seats open' },
]

export default function Events() {

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [college, setCollege] = useState('GITS')

  useEffect(() => {
    load()
  }, [college])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await eventService.getAll(college)
      setEvents(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Could not load events.'))
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let list = events
    if (filter === 'upcoming') list = list.filter((e) => isUpcoming(e.eventDate))
    if (filter === 'open') list = list.filter((e) => e.availableSeats > 0)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (e) => e.title?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q),
      )
    }
    return list
  }, [events, filter, query])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink-900">All events</h1>
        <p className="mt-1.5 text-sm text-ink-400">Search and filter what's happening on campus.</p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or venue"
            className="input pl-10"
            aria-label="Search events"
          />
          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="input w-full sm:w-auto"
            aria-label="Select college"
          >
            {COLLEGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <SlidersHorizontal size={15} className="mr-1 shrink-0 text-ink-400" />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === f.id ? 'bg-ink text-paper' : 'bg-white text-ink-600 hover:bg-ink-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <EventGrid
        events={filtered}
        loading={loading}
        error={error}
        onRetry={load}
        emptyMessage={query ? `No events match "${query}".` : 'No events match this filter yet.'}
      />
    </div>
  )
}
