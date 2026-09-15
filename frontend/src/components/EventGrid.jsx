import React from 'react'
import { CalendarX } from 'lucide-react'
import EventCard from './EventCard.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import EmptyState from './EmptyState.jsx'

export default function EventGrid({ events, loading, error, onRetry, emptyMessage }) {
  if (loading) return <LoadingSpinner label="Loading events…" fullscreen />
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />

  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title="No events to show"
        description={emptyMessage || 'Check back soon — new events are added regularly.'}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
