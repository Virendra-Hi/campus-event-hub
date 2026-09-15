import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Ticket,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  CheckCircle2,
  ArrowLeft,
  Building2,
} from 'lucide-react'
import { COLLEGES } from '../../config/colleges.js'
import api from '../../services/api.js'
const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  collegeCode: 'GITS',
}

export default function AdminSignup() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Enter your full name.'

    if (!form.email.trim()) {
      next.email = 'Enter your college or official email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.'
    }

    if (!form.password) {
      next.password = 'Create a password.'
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'Confirm your password.'
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match.'
    }

    return next
  }

 async function handleSubmit(e) {
   e.preventDefault()

   const validation = validate()

   if (Object.keys(validation).length > 0) {
     setErrors(validation)
     return
   }

   setErrors({})
   setSubmitting(true)

   try {
   await api.post('/api/admin/signup', {
     name: form.fullName.trim(),
     email: form.email.trim(),
     password: form.password,
     collegeCode: form.collegeCode,
   })

     setSubmitted(true)
   } catch (err) {
     const message =
       err.response?.data?.message ||
       err.response?.data ||
       'Could not create organizer account. Please try again.'

     setErrors({ submit: String(message) })
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
         <p className="mt-1 text-sm text-ink-100/80">
           Register as an organizer for{' '}
           {COLLEGES.find((college) => college.code === form.collegeCode)?.name}.
         </p>
        </div>

        <div className="rounded-card bg-white p-6 shadow-lift sm:p-7">
          {submitted ? (
            <div className="flex flex-col items-center py-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-50 text-moss-600">
                <CheckCircle2 size={24} />
              </span>
              <h2 className="mt-4 font-display text-xl text-ink-900">Account request submitted</h2>
              <p className="mt-2 text-sm text-ink-400">
                Your organizer account has been created successfully. You can now sign in with
                your email and password.
              </p>
              <Link to="/admin/login" className="btn-accent mt-6 w-full">
                Continue to Admin Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-2 rounded-lg bg-ink-50 px-3.5 py-2.5 text-sm font-medium text-ink-600">
                <Building2 size={15} className="shrink-0" />
                {COLLEGES.find(
                  (college) => college.code === form.collegeCode
                )?.name}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="collegeCode" className="label">
                      College
                    </label>

                    <select
                      id="collegeCode"
                      className="input"
                      value={form.collegeCode}
                      onChange={(e) => handleChange('collegeCode', e.target.value)}
                    >
                      {COLLEGES.map((college) => (
                        <option key={college.code} value={college.code}>
                          {college.name}
                        </option>
                      ))}
                    </select>
                  </div>


                <div>
                  <label htmlFor="fullName" className="label">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    className="input"
                    placeholder="Priya Verma"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                  {errors.fullName && <p className="field-error">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    College / official email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="input"
                    placeholder="priya.verma@gits.ac.in"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="input pr-11"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
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

                <div>
                  <label htmlFor="confirmPassword" className="label">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="input pr-11"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
                </div>

                <button type="submit" disabled={submitting} className="btn-accent w-full">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  {submitting ? 'Creating account…' : 'Create Organizer Account'}
                </button>
              </form>



              <div className="mt-5 flex flex-col items-center gap-2 text-sm">
                <Link to="/admin/login" className="font-medium text-ink-600 hover:text-ink">
                  Already an organizer? Log in
                </Link>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-1 text-ink-400 hover:text-ink-600"
                >
                  <ArrowLeft size={14} /> Back to website
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
