import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Ticket, Eye, EyeOff, Loader2, LogIn, ArrowLeft, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from && location.state.from !== '/admin/login' ? location.state.from : '/admin'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function validate() {
    const next = {}
    if (!identifier.trim()) next.identifier = 'Enter your admin email or username.'
    if (!password) next.password = 'Enter your password.'
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await login(identifier.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch {
      setFormError('Could not sign you in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-ink px-4 py-16">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-moss-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-ink-900">
            <Ticket size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl text-paper">Campus Event Hub</h1>
          <p className="mt-1 text-sm text-ink-100/80">Sign in to manage events and attendees.</p>
        </div>

        <div className="rounded-card bg-white p-6 shadow-lift sm:p-7">
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-ink-50 px-3.5 py-2.5 text-sm font-medium text-ink-600">
            <Building2 size={15} className="shrink-0" />
            Organizer Login
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="identifier" className="label">
                Email or username
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                className="input"
                placeholder="admin@campuseventhub.edu"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value)
                  if (errors.identifier) setErrors((er) => ({ ...er, identifier: undefined }))
                }}
              />
              {errors.identifier && <p className="field-error">{errors.identifier}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((er) => ({ ...er, password: undefined }))
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            {formError && <p className="field-error">{formError}</p>}

            <button type="submit" disabled={submitting} className="btn-accent w-full">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {submitting ? 'Signing in…' : 'Log in'}
            </button>
          </form>



          <div className="mt-5 flex flex-col items-center gap-2 text-sm">
            <Link to="/admin/signup" className="font-medium text-ink-600 hover:text-ink">
              Create organizer account
            </Link>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1 text-ink-400 hover:text-ink-600"
            >
              <ArrowLeft size={14} /> Back to website
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
