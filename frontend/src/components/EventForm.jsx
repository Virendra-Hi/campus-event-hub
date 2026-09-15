import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { validateEvent } from '../utils/validators.js'

export default function EventForm({ initialValues, submitting, submitLabel = 'Create event', onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialValues || { title: '', eventDate: '', venue: '', totalSeats: '' },
  )
  const [errors, setErrors] = useState({})

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validateEvent(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    onSubmit({ ...form, totalSeats: Number(form.totalSeats) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="title" className="label">
          Event title
        </label>
        <input
          id="title"
          className="input"
          placeholder="Tech Fest 2026"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="eventDate" className="label">
            Event date
          </label>
          <input
            id="eventDate"
            type="date"
            className="input"
            value={form.eventDate}
            onChange={(e) => handleChange('eventDate', e.target.value)}
          />
          {errors.eventDate && <p className="field-error">{errors.eventDate}</p>}
        </div>

        <div>
          <label htmlFor="totalSeats" className="label">
            Total seats
          </label>
          <input
            id="totalSeats"
            type="number"
            min="1"
            className="input"
            placeholder="200"
            value={form.totalSeats}
            onChange={(e) => handleChange('totalSeats', e.target.value)}
          />
          {errors.totalSeats && <p className="field-error">{errors.totalSeats}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="venue" className="label">
          Venue
        </label>
        <input
          id="venue"
          className="input"
          placeholder="Seminar Hall"
          value={form.venue}
          onChange={(e) => handleChange('venue', e.target.value)}
        />
        {errors.venue && <p className="field-error">{errors.venue}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
