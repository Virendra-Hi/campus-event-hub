import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin, Users, CheckCircle2 } from 'lucide-react'
import eventService from '../services/eventService.js'
import registrationService from '../services/registrationService.js'
import { getFriendlyErrorMessage } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import SeatIndicator from '../components/SeatIndicator.jsx'
import RegistrationForm from '../components/RegistrationForm.jsx'
import { formatEventDate } from '../utils/format.js'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [justRegistered, setJustRegistered] = useState(false)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await eventService.getById(id)
      setEvent(data)
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "This event couldn't be loaded."))
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(form) {
    setSubmitting(true)
    try {
      await registrationService.register(id, form)
      toast.success('You are registered! See you there.')
      setFormOpen(false)
      setJustRegistered(true)
      await load()
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Registration failed. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading event…" fullscreen />

  if (error || !event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorMessage message={error || 'Event not found.'} onRetry={load} />
        <Link to="/events" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink">
          <ArrowLeft size={15} /> Back to events
        </Link>
      </div>
    )
  }

  const isFull = event.availableSeats <= 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="card overflow-hidden">
        <div className="border-b border-ink-100/70 bg-ink px-6 py-10 text-paper sm:px-8">
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">{event.title}</h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-100/90">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} /> {formatEventDate(event.eventDate)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} /> {event.venue}
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} /> {event.totalSeats} total seats
            </span>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <SeatIndicator available={event.availableSeats} total={event.totalSeats} />

          {justRegistered && (
            <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-moss-50 px-4 py-3 text-sm text-moss-600">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>
                You're on the list for this event. You can view or cancel it anytime from{' '}
                <Link to="/my-registrations" className="font-medium underline underline-offset-2">
                  My Registrations
                </Link>
                .
              </span>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => setFormOpen(true)}
              disabled={isFull}
              className="btn-accent w-full sm:w-auto"
            >
              {isFull ? 'Registration Full' : 'Register for this event'}
            </button>
            {isFull && (
              <p className="text-sm text-ink-400">
                This event is fully booked. Check{' '}
                <Link to="/events" className="font-medium text-ink underline underline-offset-2">
                  other events
                </Link>{' '}
                happening soon.
              </p>
            )}
          </div>
        </div>
      </div>

      <RegistrationForm
        open={formOpen}
        event={event}
        submitting={submitting}
        onSubmit={handleRegister}
        onClose={() => setFormOpen(false)}
      />
    </div>
  )
}
