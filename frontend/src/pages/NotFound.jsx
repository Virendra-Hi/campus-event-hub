import React from 'react'
import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-50 text-ink-400">
        <CompassIcon size={26} />
      </span>
      <h1 className="font-display text-2xl text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-ink-400">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  )
}
