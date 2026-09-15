import React, { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { validateRegistration } from '../utils/validators.js'

export default function RegistrationForm({ open, event, submitting, onSubmit, onClose }) {
  const [form, setForm] = useState({ studentName: '', email: '', rollNumber: '' })
  const [errors, setErrors] = useState({})

  if (!open) return null

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validateRegistration(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-card bg-white p-6 shadow-lift sm:p-7">
        <button
          onClick={onClose}
          aria-label="Close registration form"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50"
        >
          <X size={18} />
        </button>

        <h3 className="font-display text-xl text-ink-900">Register for {event?.title}</h3>
        <p className="mt-1 text-sm text-ink-400">Fill in your details to save a seat.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="studentName" className="label">
              Full name
            </label>
            <input
              id="studentName"
              className="input"
              placeholder="Amit Sharma"
              value={form.studentName}
              onChange={(e) => handleChange('studentName', e.target.value)}
            />
            {errors.studentName && <p className="field-error">{errors.studentName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="amit@gmail.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="rollNumber" className="label">
              Roll number
            </label>
            <input
              id="rollNumber"
              className="input"
              placeholder="CS102"
              value={form.rollNumber}
              onChange={(e) => handleChange('rollNumber', e.target.value)}
            />
            {errors.rollNumber && <p className="field-error">{errors.rollNumber}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-accent">
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Registering…' : 'Confirm registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
