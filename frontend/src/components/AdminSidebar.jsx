import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, CalendarRange, Users2, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'


const items = [
  { to: '/admin', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/admin/events', label: 'Events', icon: CalendarRange },
  { to: '/admin/attendees', label: 'Attendees', icon: Users2 },
]

export default function AdminSidebar() {
  const { logout, adminName, collegeName } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <nav className="flex flex-col gap-1 md:w-52 md:shrink-0">
      <div className="mb-1 px-3.5">
        <p className="text-sm font-semibold text-ink-900">{collegeName}</p>
        {adminName && <p className="truncate text-xs text-ink-400">{adminName}</p>}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-ink text-paper' : 'text-ink-600 hover:bg-ink-50'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-2 flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-brick-600 hover:bg-brick-50 md:mt-4"
      >
        <LogOut size={16} />
        Log out
      </button>
    </nav>
  )
}
