import React, { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, Ticket } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const studentLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/events', label: 'Events' },
  { to: '/my-registrations', label: 'My Registrations' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { isAdminAuthenticated } = useAuth()

  useEffect(() => setOpen(false), [location.pathname])

  const adminLink = isAdminAuthenticated
    ? { to: '/admin', label: 'Admin' }
    : { to: '/admin/login', label: 'Admin Login' }

  const links = [...studentLinks, adminLink]

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100/70 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-amber-400">
            <Ticket size={16} />
          </span>
          Campus Event Hub
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ink text-paper' : 'text-ink-600 hover:bg-ink-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 hover:bg-ink-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-100/70 bg-paper px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-[15px] font-medium ${
                    isActive ? 'bg-ink text-paper' : 'text-ink-600 hover:bg-ink-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
