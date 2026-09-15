import React, { useMemo, useState } from 'react'
import { Search, Mail, User, Hash, CalendarDays, Trash2, TicketX } from 'lucide-react'
import registrationService from '../services/registrationService.js'
import { getFriendlyErrorMessage } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { formatEventDate } from '../utils/format.js'

function eventLabel(reg) {
  if (reg.event?.title) return reg.event.title
  if (reg.eventTitle) return reg.eventTitle
  if (reg.eventId) return `Event #${reg.eventId}`
  return 'Event'
}

function eventDateLabel(reg) {
  const date = reg.event?.eventDate || reg.eventDate
  return date ? formatEventDate(date) : null
}

export default function MyRegistrations() {
  const toast = useToast()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [pendingCancel, setPendingCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)



  async function load() {
    const enteredEmail = email.trim()

    if (!enteredEmail) {
      setRegistrations([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await registrationService.getByEmail(enteredEmail)
      setRegistrations(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(
        getFriendlyErrorMessage(
          err,
          'Could not load registrations.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = email.trim().toLowerCase()
    if (!q) return registrations
    return registrations.filter((r) => r.email?.toLowerCase().includes(q))
  }, [registrations, email])

  async function confirmCancel() {
    if (!pendingCancel) return
    setCancelling(true)
    try {
      await registrationService.cancel(pendingCancel.id)
      toast.success('Registration cancelled.')
      setPendingCancel(null)
      await load()
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Could not cancel this registration.'))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink-900">My Registrations</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          Enter the email you registered with to find and manage your seats.
        </p>
      </div>

      <div className="relative mb-8 max-w-sm">
        <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@college.edu"
          className="input pl-10"
          aria-label="Filter by email"
        />
        <button
          onClick={load}
          disabled={!email.trim() || loading}
          className="btn-primary mt-3"
        >
          {loading ? 'Searching…' : 'Find Registrations'}
        </button>
      </div>

      {loading && <LoadingSpinner label="Loading registrations…" fullscreen />}
      {!loading && error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={TicketX}
          title={email ? 'No registrations for that email' : 'No registrations yet'}
          description={
            email
              ? 'Double check the email address you registered with.'
              : 'Once you register for an event, it will show up here.'
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <ul className="space-y-3">
          {filtered.map((reg) => (
            <li key={reg.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg text-ink-900">{eventLabel(reg)}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-400">
                  <span className="flex items-center gap-1.5">
                    <User size={14} /> {reg.studentName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} /> {reg.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Hash size={14} /> {reg.rollNumber}
                  </span>
                  {eventDateLabel(reg) && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} /> {eventDateLabel(reg)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPendingCancel(reg)}
                className="btn-outline shrink-0 self-start border-brick-100 text-brick-600 hover:border-brick-500 sm:self-center"
              >
                <Trash2 size={15} /> Cancel
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!pendingCancel}
        title="Cancel this registration?"
        description={
          pendingCancel
            ? `${pendingCancel.studentName} will lose their seat for ${eventLabel(pendingCancel)}. This can't be undone.`
            : ''
        }
        confirmLabel={cancelling ? 'Cancelling…' : 'Yes, cancel it'}
        cancelLabel="Keep registration"
        onConfirm={confirmCancel}
        onCancel={() => setPendingCancel(null)}
      />
    </div>
  )
}
