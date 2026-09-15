import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarRange, Users2, Armchair, ArrowUpRight, Building2 } from 'lucide-react'
import eventService from '../../services/eventService.js'
import registrationService from '../../services/registrationService.js'
import { getFriendlyErrorMessage } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

import AdminSidebar from '../../components/AdminSidebar.jsx'
import StatsCard from '../../components/StatsCard.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import SeatIndicator from '../../components/SeatIndicator.jsx'
import { formatEventDate } from '../../utils/format.js'

export default function AdminDashboard() {
  const { adminName, collegeName } = useAuth()
  console.log('COLLEGE NAME:', collegeName)
  console.log('ADMIN NAME:', adminName)
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [eventsData, regsData] = await Promise.all([
        eventService.getAll(),
        registrationService.getAll(),
      ])
      setEvents(Array.isArray(eventsData) ? eventsData : [])
      setRegistrations(Array.isArray(regsData) ? regsData : [])
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Could not load dashboard data.'))
    } finally {
      setLoading(false)
    }
  }

  const totalAvailable = events.reduce((sum, e) => sum + Math.max(e.availableSeats || 0, 0), 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink-900">Admin Dashboard</h1>
        <p className="mt-1.5 text-sm text-ink-400">An overview of events and registrations.</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink-50 px-3.5 py-1.5 text-xs font-medium text-ink-600">
          <Building2 size={14} />
          {collegeName}
          {adminName && <span className="text-ink-400">· {adminName}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          {loading && <LoadingSpinner label="Loading dashboard…" fullscreen />}
          {!loading && error && <ErrorMessage message={error} onRetry={load} />}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatsCard icon={CalendarRange} label="Total events" value={events.length} tone="ink" />
                <StatsCard icon={Users2} label="Total registrations" value={registrations.length} tone="amber" />
                <StatsCard icon={Armchair} label="Seats available" value={totalAvailable} tone="moss" />
              </div>

              <div className="mt-8 card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg text-ink-900">Recent events</h2>
                  <Link
                    to="/admin/events"
                    className="inline-flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-ink"
                  >
                    Manage all <ArrowUpRight size={14} />
                  </Link>
                </div>

                {events.length === 0 ? (
                  <p className="py-8 text-center text-sm text-ink-400">No events created yet.</p>
                ) : (
                  <ul className="divide-y divide-ink-100">
                    {events.slice(0, 6).map((event) => (
                      <li key={event.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-medium text-ink-900">{event.title}</p>
                          <p className="mt-0.5 text-sm text-ink-400">
                            {formatEventDate(event.eventDate)} · {event.venue}
                          </p>
                        </div>
                        <div className="w-full sm:w-48">
                          <SeatIndicator available={event.availableSeats} total={event.totalSeats} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
