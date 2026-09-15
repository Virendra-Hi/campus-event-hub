import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, X, Users2 } from 'lucide-react'
import eventService from '../../services/eventService.js'
import { getFriendlyErrorMessage } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import AdminSidebar from '../../components/AdminSidebar.jsx'
import EventForm from '../../components/EventForm.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import SeatIndicator from '../../components/SeatIndicator.jsx'
import { formatEventDate } from '../../utils/format.js'

export default function AdminEvents() {
  const toast = useToast()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [panelOpen, setPanelOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

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
      setError(getFriendlyErrorMessage(err, 'Could not load events.'))
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditingEvent(null)
    setPanelOpen(true)
  }

  function openEdit(event) {
    setEditingEvent(event)
    setPanelOpen(true)
  }

  async function handleSubmit(payload) {
    setSubmitting(true)
    try {
      if (editingEvent) {
        await eventService.update(editingEvent.id, payload)
        toast.success('Event updated.')
      } else {
        await eventService.create(payload)
        toast.success('Event created.')
      }
      setPanelOpen(false)
      setEditingEvent(null)
      await load()
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Could not save this event.'))
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await eventService.remove(pendingDelete.id)
      toast.success('Event deleted.')
      setPendingDelete(null)
      await load()
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Could not delete this event.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Manage Events</h1>
          <p className="mt-1.5 text-sm text-ink-400">Create, edit and remove campus events.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Create event
        </button>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          {loading && <LoadingSpinner label="Loading events…" fullscreen />}
          {!loading && error && <ErrorMessage message={error} onRetry={load} />}

          {!loading && !error && events.length === 0 && (
            <EmptyState
              title="No events yet"
              description="Create your first campus event to get started."
              action={
                <button onClick={openCreate} className="btn-primary">
                  <Plus size={16} /> Create event
                </button>
              }
            />
          )}

          {!loading && !error && events.length > 0 && (
            <div className="card divide-y divide-ink-100">
              {events.map((event) => (
                <div key={event.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink-900">{event.title}</p>
                    <p className="mt-0.5 text-sm text-ink-400">
                      {formatEventDate(event.eventDate)} · {event.venue}
                    </p>
                    <div className="mt-3 max-w-xs">
                      <SeatIndicator available={event.availableSeats} total={event.totalSeats} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link to={`/admin/attendees?eventId=${event.id}`} className="btn-outline">
                      <Users2 size={15} /> Attendees
                    </Link>
                    <button onClick={() => openEdit(event)} className="btn-outline">
                      <Pencil size={15} /> Edit
                    </button>
                    <button
                      onClick={() => setPendingDelete(event)}
                      className="btn-outline border-brick-100 text-brick-600 hover:border-brick-500"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" onClick={() => setPanelOpen(false)} />
          <div className="relative w-full max-w-lg rounded-card bg-white p-6 shadow-lift sm:p-7">
            <button
              onClick={() => setPanelOpen(false)}
              aria-label="Close form"
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50"
            >
              <X size={18} />
            </button>
            <h3 className="font-display text-xl text-ink-900">
              {editingEvent ? 'Edit event' : 'Create a new event'}
            </h3>
            <p className="mt-1 text-sm text-ink-400">
              {editingEvent
                ? 'Available seats update automatically based on current registrations.'
                : 'Available seats will be set to the total seats automatically.'}
            </p>
            <div className="mt-6">
              <EventForm
                initialValues={
                  editingEvent
                    ? {
                        title: editingEvent.title,
                        eventDate: editingEvent.eventDate?.slice(0, 10) || '',
                        venue: editingEvent.venue,
                        totalSeats: editingEvent.totalSeats,
                      }
                    : undefined
                }
                submitLabel={editingEvent ? 'Save changes' : 'Create event'}
                submitting={submitting}
                onSubmit={handleSubmit}
                onCancel={() => setPanelOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this event?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" and all of its registrations will be permanently removed.`
            : ''
        }
        confirmLabel={deleting ? 'Deleting…' : 'Yes, delete it'}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
