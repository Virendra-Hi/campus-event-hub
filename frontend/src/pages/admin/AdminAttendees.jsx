import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Trash2, Users2 } from 'lucide-react'
import eventService from '../../services/eventService.js'
import registrationService from '../../services/registrationService.js'
import { getFriendlyErrorMessage } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import AdminSidebar from '../../components/AdminSidebar.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'

export default function AdminAttendees() {
  const [searchParams, setSearchParams] = useSearchParams()
  const eventId = searchParams.get('eventId') || ''
  const toast = useToast()

  const [events, setEvents] = useState([])
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingCancel, setPendingCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    loadAttendees()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  async function loadEvents() {
    try {
      const data = await eventService.getAll()
      setEvents(Array.isArray(data) ? data : [])
    } catch {
      // handled by attendee load error state
    }
  }

  async function loadAttendees() {
    setLoading(true)
    setError('')
    try {
      const data = eventId
        ? await registrationService.getForEvent(eventId)
        : await registrationService.getAll()
      setAttendees(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Could not load attendees.'))
    } finally {
      setLoading(false)
    }
  }

  async function confirmCancel() {
    if (!pendingCancel) return
    setCancelling(true)
    try {
      await registrationService.cancel(pendingCancel.id)
      toast.success('Registration cancelled.')
      setPendingCancel(null)
      await loadAttendees()
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Could not cancel this registration.'))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink-900">Attendees</h1>
        <p className="mt-1.5 text-sm text-ink-400">View and manage who has registered.</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <div className="mb-5 max-w-xs">
            <label htmlFor="eventFilter" className="label">
              Filter by event
            </label>
            <select
              id="eventFilter"
              className="input"
              value={eventId}
              onChange={(e) => {
                const value = e.target.value
                setSearchParams(value ? { eventId: value } : {})
              }}
            >
              <option value="">All events</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {loading && <LoadingSpinner label="Loading attendees…" fullscreen />}
          {!loading && error && <ErrorMessage message={error} onRetry={loadAttendees} />}

          {!loading && !error && attendees.length === 0 && (
            <EmptyState
              icon={Users2}
              title="No attendees yet"
              description="Registrations for this selection will appear here."
            />
          )}

          {!loading && !error && attendees.length > 0 && (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ink-50 text-ink-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Roll number</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {attendees.map((a) => (
                      <tr key={a.id}>
                        <td className="px-4 py-3 text-ink-900">{a.studentName}</td>
                        <td className="px-4 py-3 text-ink-400">{a.email}</td>
                        <td className="px-4 py-3 text-ink-400">{a.rollNumber}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setPendingCancel(a)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-brick-600 hover:text-brick-700"
                          >
                            <Trash2 size={14} /> Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!pendingCancel}
        title="Cancel this registration?"
        description={pendingCancel ? `${pendingCancel.studentName} will lose their seat. This can't be undone.` : ''}
        confirmLabel={cancelling ? 'Cancelling…' : 'Yes, cancel it'}
        cancelLabel="Keep registration"
        onConfirm={confirmCancel}
        onCancel={() => setPendingCancel(null)}
      />
    </div>
  )
}
